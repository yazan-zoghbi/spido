const cheerio = require("cheerio");
const axios = require("axios").default;

const Queue = require("./queue");

//define main spido crawler module class
class Spido {
  constructor(url, options) {
    this.url = url;
    this.options = {
      internalLinks: true,
      sitemap: false,
    };
    Object.assign(this.options, options);
    this.queue = new Queue();
    this.visited = new Set();
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

    const baseUrl = this.getBaseUrl(this.url) + "/";
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
          this.queue.add(link);
        })
      );
    }

    //if all options are disabled
    if (!this.options.internalLinks && !this.options.sitemap) {
      throw new Error("No options enabled!");
    }

    //run the crawler until the queue is empty
    while (!this.queue.isEmpty()) {
      this.queue.urls.forEach((url) => {
        console.log("crawling url: " + url);
        this.queue.remove(url);
        this.visited.add(url);
      });
    }
  }

  //check if url is valid & response is 200
  async isValidUrl(url) {
    return axios
      .get(url)
      .then((response) => {
        return response.status === 200;
      })
      .catch(() => {
        return false;
      });
  }

  //get sitemap url
  async getSitemap(url) {
    const baseUrl = this.getBaseUrl(url);
    return `${baseUrl}/sitemap.xml`;
  }

  //check if sitemap url is valid & response is 200
  async isSitemap(url) {
    const sitemapUrl = await this.getSitemap(url);
    return axios
      .get(sitemapUrl)
      .then((response) => {
        return response.status === 200;
      })
      .catch(() => {
        return false;
      });
  }

  //get links from website sitemap
  async getLinksFromSitemap(url) {
    const sitemapUrl = await this.getSitemap(this.url);
    const html = await this.getHTML(sitemapUrl);
    const $ = cheerio.load(html);
    const links = [];
    $("loc").each((i, link) => {
      links.push($(link).text());
    });

    const uniqueLinks = [...new Set(links)];
    return uniqueLinks;
  }

  //fetching single page seo data from url & resolve promise with the data
  async fetch(url) {
    const html = await this.getHTML(url);
    const seoData = await this.getSeoDataFromHTML(html);
    console.log("fetching seo data from url: " + url);
    return seoData;
  }

  //get the html from the url using axios & handle errors if any
  async getHTML(url) {
    const response = await axios.get(url);
    return response.data;
  }

  //getting seo data from url
  async getSeoData(url) {
    const html = await this.getHTML(url);
    const seoData = this.getSeoDataFromHTML(html);
    return seoData;
  }

  //get the links from the html & add hostname to the url if it's not present
  async getLinks(html) {
    const $ = cheerio.load(html);
    const links = [];
    $("a").each((i, link) => {
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
  async getInternalLinks(html) {
    const baseUrl = this.getBaseUrl(this.url);
    const links = await this.getLinks(html);
    const internalLinks = links.filter((link) => link.startsWith(baseUrl));
    //remove duplicates from the array
    const uniqueLinks = [...new Set(internalLinks)];
    return uniqueLinks;
  }

  //get external links only
  async getExternalLinks(html) {
    const links = this.getLinks(html);
    const externalLinks = links.filter((link) => !link.startsWith(this.url));
    return externalLinks;
  }

  //get hostname from header of url & add https:// to the url if it's not present
  getHostname(url) {
    if (!this.url) {
      throw new Error("url not defined");
    }

    url = this.url;
    const hostname = url.split("/")[2];
    return hostname.replace("www.", "");
  }

  //get path name base url
  getPath(url) {
    const baseUrl = this.getBaseUrl(url);
    const path = baseUrl.replace(baseUrl, "/");
    return path;
  }

  //get base url from hostname
  getBaseUrl(url) {
    const hostname = this.getHostname(url);
    return `https://${hostname}`;
  }

  //get seo data from html
  async getSeoDataFromHTML(html) {
    const $ = cheerio.load(html);
    const seoData = {};
    seoData.title = $("title").text();
    seoData.description = $("meta[name='description']").attr("content");
    seoData.canonical = $("link[rel='canonical']").attr("href");
    seoData.robots = $("meta[name='robots']").attr("content");
    seoData.links = (await this.getLinks(html)).length;
    return seoData;
  }
}

module.exports = Spido;
