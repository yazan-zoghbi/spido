![npm](https://img.shields.io/npm/v/spido)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

## Overview 📝

It is a module that crawls sites and extracts basic information on any web page of interest to site owners in general, and SEO specialists in particular, which enables them to use that information in analyzing the efficiency and performance of their site in search engines.

## Features🥁

- Crawling: The module can crawl the entire internal links of any site, and extract SEO information from site pages
- Fetching: Extracting SEO information from a single web page.

## Installation 📦

`npm install spido --save` or `yarn add spido`

## Usage ⌨️

To make spido suitable for all uses, it will be developed repeatedly for use in API projects or
used independently within the CLI.

### API 📡

Spido can be used as a Node.js module, which can return the SEO information in JSON format.

- fetch: Fetches the SEO information from a single web page.

```
const spido = require('spido');
const url = 'https://www.google.com';
spido.fetch(url, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    return (data);
  }
});
```

- crawl: Crawls the entire internal links of any site, and extract SEO information from site pages.

```
const spido = require('spido');
const url = 'https://www.google.com';
spido.crawl(url, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    return (data);
  }
});
```

more information about spido API's can be found in [API's Documentation](docs/usage/1-api.md).

### CLI 💻

spido can be used as a command line tool, which can return the SEO information and print it on the console.

- fetch: `spido fetch <url>`

```
$ spido fetch https://www.example.com
```

- crawl: `spido crawl <url>`

```
$ spido crawl https://www.example.com
```

more information about spido CLI can be found in [CLI Documentation](docs/usage/2-cli.md).

## New Features 🐛

### v1.4.3:

- images now can be extracted from html pages with utils getImages(url).
- heading tags can now be extracted from html pages with getHeadings(url).
- JsDoc added to all utils functions, it should be easier now for developers to understand how features / functions would works

## Credits

- [@Yazan-Zoghbi](https://github.com/yazan-zoghbi)- original author
- [@karam-mustafa](https://github.com/karam-mustafa) - organization maintainer
- [@Yamanlk](https://github.com/Yamanlk) - cli contributor

## Links 🔗

- [npm](https://www.npmjs.com/package/spido)
- [yarn](https://yarnpkg.com/en/package/spido)
