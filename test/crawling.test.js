const dotenv = require("dotenv").config();
const Spido = require("../index");
const url = process.env.URL;

// test crawl website with default options
async function testCrawl2() {
  const crawler = new Spido();
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

  //check if url valid
  const isValidUrl = await crawler.isValidUrl(url).catch((err) => {
    console.log(err);
  });
  console.log(isValidUrl);

  await crawler.crawl().catch((err) => {
    console.log(err);
  });
  console.log("crawler.visited: " + crawler.visited.size);
}

testCrawl2();
