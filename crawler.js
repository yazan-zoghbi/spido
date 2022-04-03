const cheerio = require("cheerio");
const axios = require("axios").default;

const Queue = require("./queue");

//define main seo crawler module class
class Crawler {
  constructor(url) {
    this.url = url;
    this.queue = new Queue();
    this.visited = new Set();
  }

  //get the url from the queue and remove it from the queue after
  //it's been visited and add it to the visited set to avoid duplicates
  //in the queue and visited set respectively

  async crawl() {
    this.queue.add(this.url);
    console.log(this.queue.urls);
    console.log(this.getHostname(this.url));
    while (!this.queue.isEmpty()) {
      const html = await this.getHTML(this.url);
      const links = this.getLinks(html);
      await Promise.allSettled(
        links.map(async (link) => {
          const seoData = await this.getSeoData(link);
          if (!this.visited.has(link)) {
            this.queue.add(link);
            this.visited.add(link);
            console.log(link);
            console.log(seoData);
          }
          this.queue.remove(link);
        })
      );
    }
    //print how many urls were visited
    console.log("The number of crawled url's is: " + this.visited.size);
  }

  //fetching single page seo data from url & handle errors if any
  async fetch(url) {
    try {
      const seoData = await this.getSeoData(url);
      return seoData;
    } catch (error) {
      return error;
    }
  }

  //get the html from the url using axios & handle errors if any
  async getHTML(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  //getting seo data from url
  async getSeoData(url) {
    try {
      const html = await this.getHTML(url);
      const seoData = await this.getSeoDataFromHTML(html);
      return seoData;
    } catch (error) {
      return error;
    }
  }

  //get the links from the html & add hostname to the url if it's not present
  getLinks(html) {
    const $ = cheerio.load(html);
    const links = [];
    $("a").each((i, link) => {
      const href = $(link).attr("href");
      if (href) {
        if (href.startsWith("http")) {
          links.push(href);
        } else {
          links.push(this.getHostname(this.url) + href);
        }
      }
    });

    //remove external links from the links array
    return links.filter((link) => link.includes(this.getHostname(this.url)));
  }

  //get hostname from header of url & add https:// to the url if it's not present
  getHostname(url) {
    const hostname = url.split("/")[2];
    return hostname.includes("https") ? hostname : `https://${hostname}`;
  }

  //get seo data from html
  getSeoDataFromHTML(html) {
    try {
      const $ = cheerio.load(html);
      const seoData = {};
      seoData.title = $("title").text();
      seoData.description = $("meta[name='description']").attr("content");
      seoData.keywords = $("meta[name='keywords']").attr("content");
      seoData.canonical = $("link[rel='canonical']").attr("href");
      seoData.robots = $("meta[name='robots']").attr("content");
      seoData.links = this.getLinks(html).length;
      return seoData;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Crawler;
