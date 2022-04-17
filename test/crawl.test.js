const dotenv = require("dotenv").config();
const Spido = require("../index");
const url = process.env.URL;

jest.setTimeout(60000);

//test crawling process with default options
test("crawl website with default options", async () => {
  const crawler = new Spido(url);
  console.log(crawler.options);

  expect(crawler.options.internalLinks).toBe(true);
  expect(crawler.options.sitemap).toBe(false);

  //test crawling process ends with no errors

  await crawler.crawl();
  expect(crawler.visited.size).toBeGreaterThan(0);
  expect(crawler.queue.urls.length).toBe(0);
});

//test crawling process with internal links disabled
test("crawl website with internal links disabled", async () => {
  const crawler = new Spido(url, { internalLinks: false });
  console.log(crawler.options);

  expect(crawler.options.internalLinks).toBe(false);
  expect(crawler.options.sitemap).toBe(false);

  //test crawling process ends with no errors
  await crawler.crawl();
  expect(crawler.visited.size).toBeGreaterThan(0);
  expect(crawler.queue.urls.length).toBe(0);
});

//test crawling process with sitemap enabled
test("crawl website with sitemap enabled", async () => {
  const crawler = new Spido(url, { sitemap: true });
  console.log(crawler.options);

  expect(crawler.options.internalLinks).toBe(true);
  expect(crawler.options.sitemap).toBe(true);

  //test crawling process ends with no errors
  await crawler.crawl();
  expect(crawler.visited.size).toBeGreaterThan(0);
  expect(crawler.queue.urls.length).toBe(0);
});
