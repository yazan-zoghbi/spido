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

### CLI 💻

spido can be used as a command line tool, which can return the SEO information and print it on the console.

- fetch: `spido -u <url> -f`

```
$ spido -u https://www.example.com -f
```

- crawl: `spido -u <url> -c`

```
$ spido -u https://www.example.com -c
```

## Bug Fixes 🐛

- Nothing yet

## TODO 🛠

- Extract the information and save it to a JSON file
- Limit the number of links that can be crawled in a website
- Fully embedding with CLI
- The ability to use as a docker image

## Links 🔗

- [npm](https://www.npmjs.com/package/spido)
- [yarn](https://yarnpkg.com/en/package/spido)
