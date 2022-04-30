const dotenv = require("dotenv").config();
const { expect } = require("@jest/globals");
const Spido = require("..");
const url = process.env.URL;

jest.setTimeout(60000);

//before Each test define a new crawler instance
beforeEach(() => {
  crawler = new Spido(url);
});

//test crawling process with default options
test("crawl website with default options", async () => {
  console.log(crawler.options);

  expect(crawler.options.internalLinks).toBe(true);
  expect(crawler.options.sitemap).toBe(false);

  //test crawling process ends with no errors

  await crawler.crawl();
  expect(crawler.visited.size).toBeGreaterThan(0);
  expect(crawler.queue.urls.length).toBe(0);
});

//test crawling process with internal links disabled
it("crawl website with internal links disabled", async () => {
  crawler.options.internalLinks = false;
  console.log(crawler.options);

  //expect to throw error
  expect(crawler.crawl()).rejects.toThrow();

  crawler.crawl().catch((err) => {
    expect(err.message).toBe("No options enabled!");
  });
  expect(crawler.options.internalLinks).toBe(false);
  expect(crawler.options.sitemap).toBe(false);
});

//test crawling process with sitemap enabled
test("crawl website with sitemap enabled", async () => {
  crawler.options.sitemap = true;
  console.log(crawler.options);

  expect(crawler.options.internalLinks).toBe(true);
  expect(crawler.options.sitemap).toBe(true);

  //test crawling process ends with no errors
  await crawler.crawl();
  expect(crawler.visited.size).toBeGreaterThan(0);
  expect(crawler.queue.urls.length).toBe(0);
});

//test return seo data for crawled links
test("get seo data for crawled links", async () => {
  await crawler.crawl();
  const seoData = crawler.websiteSeoData;
  expect(seoData).toBeDefined();
});
