import Queue from "./queue";
import * as utils from "./utils";

//define main spido crawler module class
export class Spido {
  queue: Queue;
  url: string;
  options: { internalLinks: boolean; sitemap: boolean };
  visited: Set<string>;
  websiteSeoData: any[];
  constructor(url: string, options: object) {
    this.url = url;
    this.options = {
      internalLinks: true,
      sitemap: false,
    };
    Object.assign(this.options, options);
    this.queue = new Queue();
    this.visited = new Set();
    this.websiteSeoData = [];
  }

  //get the url from the queue and remove it from the queue after
  //it's been visited and add it to the visited set to avoid duplicates
  //in the queue and visited set respectively

  async crawl() {
    //if url not defined throw error
    if (!this.url) {
      throw new Error("url not defined! please define url");
    }

    const isValidUrl = await utils.isValidUrl(this.url);
    if (!isValidUrl) {
      throw new Error("Invalid url! - " + this.url);
    }

    const baseUrl = utils.getBaseUrl(this.url);
    this.queue.enqueue(baseUrl);

    //if internal links are enabled
    if (this.options.internalLinks) {
      await this.internalLinksEnabled(this.url);
    }

    //if sitemap is enabled
    if (this.options.sitemap) {
      const isSitemap = await utils.isSitemap(this.url);

      if (!isSitemap) {
        throw new Error("Invalid sitemap url! - " + utils.getSitemap(this.url));
      }

      const sitemapLinks = await utils.getLinksFromSitemap(this.url);
      Promise.allSettled(
        sitemapLinks.map(async (link) => {
          if (!this.queue.urls.includes(link)) {
            this.queue.enqueue(link);
          }
        })
      );
    }

    //if all options are disabled
    if (!this.options.internalLinks && !this.options.sitemap) {
      throw new Error("No options enabled!");
    }

    //while visited urls are less than the queue urls
    while (
      this.queue.urls.length > 0 &&
      this.queue.urls.length != this.visited.size
    ) {
      console.log("visited urls: " + this.visited.size);
      console.log("queue urls: " + this.queue.urls.length);

      for (let i = 0; i < this.queue.urls.length; i++) {
        let currentUrl = this.queue.urls[i];
        if (!this.visited.has(currentUrl)) {
          console.log("visiting url: " + currentUrl + ", i: " + i);
          const html = await utils.getHTML(currentUrl);
          const internalLinks = await utils.getInternalLinks(currentUrl, html);
          internalLinks.forEach(async (link) => {
            const isValidLink = await utils.isValidUrl(link);
            if (
              isValidLink &&
              !this.queue.urls.includes(link) &&
              !this.visited.has(link)
            ) {
              this.queue.enqueue(link);
            }
          });
          this.visited.add(currentUrl);
        }
        await this.fetch(currentUrl);
      }
    }
    console.log("crawling finished");
  }

  //fetching single page seo data from url & resolve promise with the data
  async fetch(url: string) {
    const html = await utils.getHTML(url);
    const seoData = await utils.getSeoDataFromHTML(html, url);
    return this.websiteSeoData.push(seoData);
  }

  private async internalLinksEnabled(url: string) {
    const html = await utils.getHTML(url);
    const internalLinks = await utils.getInternalLinks(url, html);

    internalLinks.forEach(async (link: string) => {
      const isValidLink = await utils.isValidUrl(link);
      if (isValidLink && !this.queue.urls.includes(link)) {
        this.queue.enqueue(link);
      }
    });
  }
}
