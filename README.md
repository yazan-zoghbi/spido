![npm](https://img.shields.io/npm/v/spido)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

## Overview 📝

Spido is a powerful module designed to crawl websites and extract essential information from web pages. It caters to site owners, SEO specialists, and anyone interested in analyzing the efficiency and performance of their website in search engines. By utilizing Spido, users can gain valuable insights that help them optimize their website's visibility and improve its overall ranking on search engine results pages.

## Features🥁

**Crawling:** Spido's advanced crawler can efficiently traverse all internal links within a website, extracting valuable SEO information from each page. With its robust crawling capabilities, Spido empowers users to gain insights into the overall structure and content of their website.- Fetching: Extracting SEO information from a single web page.

**Fetching:** Extracting SEO information from a single web page is made easy with Spido. Users can retrieve key details and metadata about individual web pages, enabling them to analyze and optimize specific URLs for improved search engine visibility.

**In-Memory Caching:** Spido incorporates an intelligent in-memory caching mechanism that enhances the speed and efficiency of the crawling process. By caching previously visited pages, Spido minimizes redundant requests, resulting in faster performance and reduced load on the target website.

## Installation 📦

`npm install spido --save` or `yarn add spido`

## Usage ⌨️

To make spido suitable for all uses, it will be developed repeatedly for use in API projects or
used independently within the CLI.

### API 📡

Spido can be used as a Node.js module to retrieve SEO information in JSON format. Here's an example of how to use Spido's crawling functionality:

```
const Spido = require('spido');

async function getWebsiteMetaData() {
  const url = "https://www.example.com";

  const crawler = new Spido(url);

  await crawler.crawl();

  return crawler.websiteSeoData;
}

getWebsiteMetaData()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### CLI 💻 (Upcoming Release)

Spido offers a command-line interface (CLI) that allows you to fetch and crawl websites, providing SEO information directly on the console.

**Note: The CLI functionality is currently being enhanced and will be available in the next version.**

Stay tuned for the upcoming release, which will introduce new commands and better interface

We appreciate your patience as we work on delivering an enhanced CLI experience for Spido. Stay tuned for the release announcement!

## New Features 🆕

### v1.5.0:

- In-Memory Cache: Spido now includes an in-memory cache to improve performance by caching previously crawled pages.
- Enhanced Types: Spido now offers better type definitions, providing improved type safety and developer experience.
- Significant Speed Improvements: With the latest optimizations, Spido now offers faster crawling and fetching capabilities, allowing for quicker analysis of website SEO.

## Credits

- [@Yazan-Zoghbi](https://github.com/yazan-zoghbi)- original author
- [@Yamanlk](https://github.com/Yamanlk) - cli contributor

## Links 🔗

- [npm](https://www.npmjs.com/package/spido)
- [yarn](https://yarnpkg.com/en/package/spido)
