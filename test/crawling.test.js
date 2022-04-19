const dotenv = require("dotenv").config();
const Spido = require("../index");
const url = process.env.URL;

// test crawl website with default options
async function testCrawl2() {
  const crawler = new Spido(url);
  console.log(crawler.options);
  
  //get hostname from url
  const hostname = crawler.getHostname(url);
  console.log(hostname);

  //get main path from url
  const path = crawler.getPath(url);
  console.log(path);

  //get base url from url
  const baseUrl = crawler.getBaseUrl(url);
  console.log(baseUrl);

  //get sitemap
  const sitemap = await crawler.getSitemap(url);
  console.log(sitemap);
  //get links from sitemap
  const sitemapLinks = await crawler.getLinksFromSitemap(url);
  console.log("Sitemap Links: " + sitemapLinks.length);

  //get internal links
  const html = await crawler.getHTML(url);
  const internalLinks = await crawler.getInternalLinks(html);
  console.log("Internal Links: " + internalLinks.length);

  //get queue urls
  console.log("crawler.queue.urls: " + crawler.queue.urls.length);

  await crawler.crawl();
  console.log("crawler.visited: " + crawler.visited.size);
}

testCrawl2();
