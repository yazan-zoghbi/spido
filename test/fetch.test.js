const dotenv = require("dotenv").config();
const Spido = require("../index");
const url = process.env.URL;

//testing return html from url with crawler
test("get html from url", async () => {
  const crawler = new Spido(url);
  const html = await crawler.getHTML(url);
  expect(html).toBeDefined();
  expect(html.length).toBeGreaterThan(0);
});

//testing return seo data from url with crawler
test("get seo data from url", async () => {
  const crawler = new Spido(url);
  const html = await crawler.getHTML(url);
  const seoData = await crawler.getSeoData(url);
  expect(seoData).toBeDefined();

  //test if seo data is an object with properties types and values are strings
  expect(seoData).toMatchObject({
    title: expect.any(String),
    description: expect.any(String),
    canonical: expect.any(String),
    robots: expect.any(String),
    links: expect.any(Number),
  });

  //test loop if all seo data object properties are defined and have values
  for (let property in seoData) {
    expect(seoData[property]).toBeDefined();
  }
});

//testing return links from html with crawler
test("get links from html", async () => {
  const crawler = new Spido(url);
  const html = await crawler.getHTML(url);
  const links = await crawler.getLinks(html);
  expect(links).toBeDefined();
  expect(links.length).toBeGreaterThan(0);
});

//testing return hostname from url with crawler
test("get hostname from url", async () => {
  const crawler = new Spido(url);
  const hostname = await crawler.getHostname(url);
  expect(hostname).toBeDefined();
  expect(hostname.length).toBeGreaterThan(0);
});
