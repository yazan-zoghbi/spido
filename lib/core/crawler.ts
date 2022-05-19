import cheerio from "cheerio";
import axios from "axios";

import Queue from "./queue";

//define main spido crawler module class
export default class Spido {
  url: string;
  options: { internalLinks: boolean; sitemap: boolean };
  queue: any;
  visited: Set<unknown>;
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

    const isValidUrl = await this.isValidUrl(this.url);
    if (!isValidUrl) {
      throw new Error("Invalid url! - " + this.url);
    }

    const baseUrl = this.getBaseUrl(this.url);
    this.queue.add(baseUrl);

    //if internal links are enabled
    if (this.options.internalLinks) {
      const html = await this.getHTML(this.url);
      const internalLinks = await this.getInternalLinks(html);
      internalLinks.forEach((link) => {
        if (!this.queue.urls.includes(link)) {
          this.queue.add(link);
        }
      });
    }

    //if sitemap is enabled
    if (this.options.sitemap) {
      const isSitemap = await this.isSitemap(this.url);

      if (!isSitemap) {
        throw new Error("Invalid sitemap url! - " + this.getSitemap(this.url));
      }

      const sitemapLinks = await this.getLinksFromSitemap(this.url);
      Promise.allSettled(
        sitemapLinks.map(async (link) => {
          if (!this.queue.urls.includes(link)) {
            this.queue.add(link);
          }
        })
      );
    }

    //if all options are disabled
    if (!this.options.internalLinks && !this.options.sitemap) {
      throw new Error("No options enabled!");
    }

    //run the crawler until the queue is empty
    while (!this.queue.isEmpty()) {
      const urls = this.queue.urls;
      const seoData = await Promise.allSettled(
        urls.map(async (url: string) => {
          console.log("crawling url: " + url);
          this.visited.add(url);
          this.queue.remove(url);
          const seoData = await this.fetch(url);
          return this.websiteSeoData.push(seoData);
        })
      );
    }
    return this.websiteSeoData;
  }

  //check if url is valid & response is ok
  async isValidUrl(url: string) {
    const validResponse = await axios
      .request({
        url,
        maxRedirects: 0,
      })
      .catch(async (error: any) => {
        if (
          error.response.status === 300 ||
          301 ||
          302 ||
          303 ||
          304 ||
          305 ||
          306 ||
          307 ||
          308
        ) {
          return await axios
            .get(error.response.headers.location)
            .then((response: any) => {
              if (response.status === 200) {
                return true;
              } else {
                return false;
              }
            });
        }
      });
    return validResponse;
  }

  //get sitemap url
  async getSitemap(url: string) {
    const baseUrl = this.getBaseUrl(url);
    return `${baseUrl}/sitemap.xml`;
  }

  //check if sitemap url is valid & response is 200
  async isSitemap(url: string) {
    const sitemapUrl = await this.getSitemap(url);
    return axios
      .get(sitemapUrl)
      .then((response: any) => {
        return response.status === 200;
      })
      .catch(() => {
        return false;
      });
  }

  //get links from website sitemap
  async getLinksFromSitemap(url: string) {
    const sitemapUrl = await this.getSitemap(this.url);
    const html = await this.getHTML(sitemapUrl);
    const $ = cheerio.load(html);
    const links: any[] = [];
    $("loc").each((i: any, link) => {
      links.push($(link).text());
    });

    const uniqueLinks = [...new Set(links)];
    return uniqueLinks;
  }

  //fetching single page seo data from url & resolve promise with the data
  async fetch(url: string) {
    const html = await this.getHTML(url);
    const seoData = await this.getSeoDataFromHTML(html, url);
    console.log("fetching seo data from url: " + url);
    return seoData;
  }

  //get the html from the url using axios & handle errors if any
  async getHTML(url: string) {
    const response = await axios.get(url);
    return response.data;
  }

  //getting seo data from url
  async getSeoData(url: string) {
    if (url) {
      const html = await this.getHTML(url);
      const seoData = this.getSeoDataFromHTML(html, url);
      return seoData;
    }
  }

  //get the links from the html & add hostname to the url if it's not present
  async getLinks(html: any) {
    const $ = cheerio.load(html);
    const links: any[] = [];
    $("a").each((i: any, link) => {
      const href = $(link).attr("href");
      const hostname = this.getHostname(this.url);
      const baseUrl = this.getBaseUrl(this.url);

      //if the link is not a relative url
      if (href) {
        if (href.startsWith(baseUrl)) {
          links.push(href);
        }
        //if the link is relative url
        else if (href.startsWith("/")) {
          links.push(`${baseUrl}${href}`);
        }
      } else {
        links.push(hostname + "/" + href);
      }
    });
    return links;
  }

  //get internal links array
  async getInternalLinks(html: any) {
    const baseUrl = this.getBaseUrl(this.url);
    const links = await this.getLinks(html);
    const internalLinks = links.filter((link) => link.startsWith(baseUrl));
    //remove duplicates from the array
    const uniqueLinks = [...new Set(internalLinks)];
    return uniqueLinks;
  }

  //get external links only
  async getExternalLinks(html: any) {
    const links = this.getLinks(html);
    const externalLinks = (await links).filter(
      (link: string) => !link.startsWith(this.url)
    );
    return externalLinks;
  }

  //get current url
  async getCurrentUrl(url: string) {
    const response = await axios.get(url);
    return response.request.res.responseUrl;
  }

  //get hostname from header of url & add https:// to the url if it's not present
  getHostname(url: string) {
    if (!this.url) {
      throw new Error("url not defined");
    }

    url = this.url;
    const hostname = url.split("/")[2];
    return hostname.replace("www.", "");
  }

  //get path name base url
  getPath(url: string) {
    const baseUrl = this.getBaseUrl(url);
    const path = baseUrl.replace(baseUrl, "/");
    return path;
  }

  //get base url from hostname
  getBaseUrl(url: string) {
    const hostname = this.getHostname(url);
    return `https://${hostname}`;
  }

  //get seo data from html
  async getSeoDataFromHTML(html: any, url: string) {
    const $ = cheerio.load(html);
    const seoData: any = {};
    seoData.url = url.toString();
    seoData.title = $("title").text();
    seoData.description = $("meta[name='description']").attr("content");
    seoData.canonical = $("link[rel='canonical']").attr("href");
    seoData.robots = $("meta[name='robots']").attr("content");
    seoData.links = (await this.getLinks(html)).length;
    return seoData;
  }
}
