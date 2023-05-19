import { Queue } from "./queue";
import { Utils } from "./utils";
import {
  Cache,
  CachedEntry,
  CrawlerOptions,
  HttpResponse,
  Metadata,
} from "./interfaces";

//define main spido crawler module class
export class Spido {
  private url: string;
  private options: CrawlerOptions;
  private cache: Cache;
  private utils: Utils;
  visited: Set<string>;
  queue: Queue;
  websiteSeoData: Metadata[];

  constructor(url: string, options?: CrawlerOptions) {
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
    this.utils = new Utils();
  }

  async crawl() {
    const baseURL = await this.utils.getBaseUrl(this.url);
    this.queue.enqueue(baseURL);

    while (!this.queue.isEmpty()) {
      const currentURL = this.queue.dequeue();
      if (
        !currentURL ||
        this.visited.has(currentURL) ||
        this.isDepthExceeded(currentURL)
      ) {
        continue;
      }

      const cachedResponse = this.cache[currentURL];
      if (cachedResponse) {
        await this.handleResponse(currentURL, cachedResponse.response);
      } else {
        const response = await this.utils.getResponse(currentURL);

        if (response) {
          await this.handleResponse(currentURL, response);
        }
      }
      this.visited.add(currentURL);
    }

    return this.websiteSeoData;
  }

  private isDepthExceeded(url: string): boolean {
    const depth = this.options.depth;
    return depth !== 0 && this.utils.getUrlPathDepth(url) > depth;
  }

  async handleResponse(url: string, response: HttpResponse) {
    try {
      if (!this.cache[url]) {
        const SEOData = await this.utils.getSeoDataFromResponse(
          response.response,
          url
        );
        const cacheResponse: CachedEntry = {
          response: response,
          internalLinks: await this.utils.getInternalLinks(response),
          isValid: await this.utils.isValidUrl(response.response.status),
          pathDepth: this.utils.getUrlPathDepth(url),
        };
        this.cache[url] = cacheResponse;
        this.websiteSeoData.push(SEOData);
        await this.enqueueURLs(cacheResponse.internalLinks);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async enqueueURLs(urls: string[]) {
    for (const currentURL of urls) {
      if (
        !this.visited.has(currentURL) &&
        !this.queue.isURLInQueue(currentURL)
      ) {
        this.queue.enqueue(currentURL);
      }
    }
  }

  //fetching single page seo data from url & resolve promise with the data
  async fetch(url: string) {
    const response = await this.utils.getResponse(url);
    const responseData = response?.response.data;

    const seoData = await this.utils.getSeoDataFromResponse(responseData, url);
    return this.websiteSeoData.push(seoData);
  }

  private async internalLinksEnabled(url: string) {
    const response = await this.utils.getResponse(url);
    const responseData = response?.response.data;

    const internalLinks = await this.utils.getInternalLinks(responseData);

    internalLinks.forEach(async (link: string) => {
      const isValidLink = await this.utils.isValidUrl(
        responseData.response.status
      );
      if (isValidLink && !this.queue.urls.includes(link)) {
        this.queue.enqueue(link);
      }
    });
  }
}

module.exports = { Spido };
