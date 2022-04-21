#!/usr/bin/env node

const { program } = require("commander");

const Spido = require("./lib/crawler.cjs");

program
  .name("spido")
  .description("Spido CLI - A command line tool for crawling websites")
  .usage("<command>")
  .addHelpCommand(true)
  .helpOption(true)
  .version("1.1.2");

program
  .command("crawl")
  .argument("<url>", "the url you'd like to crawl")
  .option("-s, --sitemap", "crawl sitemap links")
  .option("-i, --internal", "crawl internal links")
  .description("crawl the website")
  .action(async (url, options) => {
    const crawler = new Spido(url);

    if (options.sitemap) {
      crawler.options.sitemap = true;
      console.log("crawling sitemap...");
    }
    if (options.internal) {
      crawler.options.internalLinks = true;
      console.log("crawling internal links...");
    }

    if (!options.sitemap && !options.internal) {
      throw new Error("invalid arguments! please consider using -s | -i");
    }

    await crawler.crawl();
  });

program
  .command("fetch")
  .argument("<url>", "the url you'd like to fetch")
  .description("fetch seo data from url")
  .action(async (url) => {
    const crawler = new Spido(url);
    const data = await crawler.fetch(url);
    console.log(data);
  });

program.parse(process.argv);

module.exports = Spido;
