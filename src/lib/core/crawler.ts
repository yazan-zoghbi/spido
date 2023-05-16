import axios, { AxiosResponse } from "axios";
import { Queue } from "./queue";
import { Utils, Response } from "./utils";

const utils = new Utils();

interface CacheEntry {
  response: Response;
  internalLinks: string[];
  isValid: boolean;
  pathDepth: number;
}

type Cache = {
  [url: string]: CacheEntry;
};

//define main spido crawler module class
export class Spido {
  queue: Queue;
  url: string;
  options: { internalLinks: boolean; sitemap: boolean; depth: number };
  visited: Set<string>;
  websiteSeoData: any[];
  cache: Cache;

  constructor(url: string, options: object) {
    this.url = url;
    this.options = {
      internalLinks: true,
      sitemap: false,
      depth: 0,
    };
    this.cache = {};
    Object.assign(this.options, options);
    this.queue = new Queue();
    this.visited = new Set();
    this.websiteSeoData = [];
  }

  async crawl() {
    const startingURL = this.url;
    const options = this.options;

    const baseURL = await utils.getBaseUrl(startingURL);
    this.queue.enqueue(baseURL);

    while (!this.queue.isEmpty()) {
      const currentURL = this.queue.dequeue();
      if (!currentURL) {
        continue;
      }

      if (this.visited.has(currentURL)) {
        continue;
      }

      if (
        options.depth &&
        (utils.getUrlPathDepth(currentURL) ?? 0) > options.depth
      ) {
        continue;
      }

      const cachedResponse = this.cache[currentURL];
      if (cachedResponse) {
        await this.handleResponse(currentURL, cachedResponse.response);
      } else {
        const response = await utils.getResponse(currentURL);
        await this.handleResponse(currentURL, response);
      }
      this.visited.add(currentURL);
    }

    console.log("crawling finished, visited URLs: ", this.visited.size);
    console.log(this.visited);

    return this.websiteSeoData;
  }

  private async handleResponse(url: string, response: Response) {
    try {
      if (!this.cache[url]) {
        const SEOData = await utils.getSeoDataFromHTML(response.response, url);
        const cacheResponse: CacheEntry = {
          response: response,
          internalLinks: await utils.getInternalLinks(response),
          isValid: await utils.isValidUrl(response.response.status),
          pathDepth: utils.getUrlPathDepth(url),
        };
        this.cache[url] = cacheResponse;
        this.websiteSeoData.push(SEOData);
        await this.enqueueURLs(cacheResponse.internalLinks);
        return;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async enqueueURLs(urls: string[]) {
    for (const currentURL of urls) {
      if (this.visited.has(currentURL)) {
        continue;
      }

      if (this.queue.isURLInQueue(currentURL)) {
        continue;
      }

      this.queue.enqueue(currentURL);
    }
  }

  //fetching single page seo data from url & resolve promise with the data
  async fetch(url: string) {
    const response = (await utils.getResponse(url)).response.data;
    const seoData = await utils.getSeoDataFromHTML(response, url);
    return this.websiteSeoData.push(seoData);
  }

  private async internalLinksEnabled(url: string) {
    const response = await utils.getResponse(url);
    const internalLinks = await utils.getInternalLinks(response);

    internalLinks.forEach(async (link: string) => {
      const isValidLink = await utils.isValidUrl(response.response.status);
      if (isValidLink && !this.queue.urls.includes(link)) {
        this.queue.enqueue(link);
      }
    });
  }
}

module.exports = { Spido };
