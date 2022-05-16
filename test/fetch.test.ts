import "dotenv/config";
import Spido from "..";

const URL = process.env.URL || "https://www.google.com";
const crawler = new Spido(URL, {});

//testing return html from url with crawler
test("get html from url", async () => {
  const html = await crawler.getHTML(URL);
  expect(html).toBeDefined();
  expect(html.length).toBeGreaterThan(0);
});

//testing return seo data from url with crawler
test("get seo data from url", async () => {
  const html = await crawler.getHTML(URL);
  const seoData = await crawler.getSeoData(URL);
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
  const html = await crawler.getHTML(URL);
  const links = await crawler.getLinks(html);
  expect(links).toBeDefined();
  expect(links.length).toBeGreaterThan(0);
});

//testing return hostname from url with crawler
test("get hostname from url", async () => {
  const hostname = crawler.getHostname(URL);
  expect(hostname).toBeDefined();
  expect(hostname.length).toBeGreaterThan(0);
});
