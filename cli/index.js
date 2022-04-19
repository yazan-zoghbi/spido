//require yargs and spido crawler
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const Spido = require("../lib/crawler");

//define -u for url & show describe message to use it and make usage "spido -u <url>"
const urlArgv = yargs(hideBin(process.argv)).option("url", {
  alias: "u",
  type: "string",
  describe: "url to crawl",
  demandOption: true,
}).argv;

//define -f for fetching seo data from url & show describe message to use it and make usage "spido -u <url> -f"
const fetchArgv = yargs(hideBin(process.argv)).option("fetch", {
  alias: "f",
  type: "boolean",
  describe: "fetch seo data from url",
  demandOption: true,
}).argv;

//define -c for crawling the url & show describe message to use it and make usage "spido -u <url> -c"
const crawlArgv = yargs(hideBin(process.argv)).option("crawl", {
  alias: "c",
  type: "boolean",
  describe: "crawl the url",
  demandOption: true,
}).argv;

//define spido crawler with url from urlArgv
const spido = new Spido(urlArgv.url);

//fetch or crawl seo data from url if arguments are provided
if (urlArgv.url) {
  if (fetchArgv.fetch) {
    spido.fetch(urlArgv.url).then((data) => {
      console.log(data);
    });
  } else if (crawlArgv.crawl) {
    spido.crawl(urlArgv.url);
  } else {
    console.log("invalid arguments! please consider using -u <url> -f | -c");
  }
} else {
  console.log("invalid arguments! please consider using -u <url> -f | -c");
}
