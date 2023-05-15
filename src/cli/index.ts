#!/usr/bin/env node

import { program } from "commander";

const { Spido } = require("../lib/core/crawler");
const utils = require("./utils");

program
  .name("spido")
  .description("Spido CLI - A command line tool for crawling websites")
  .usage("<command>")
  .addHelpCommand(true)
  .helpOption(true)
  .version("1.2.0 beta");

program
  .command("crawl")
  .argument("<url>", "the url you'd like to crawl")
  .option("-s, --sitemap", "crawl sitemap links")
  .option("-i, --internal", "crawl internal links")
  .description("crawl the website")
  .action(async (url: string, options: any) => {
    const crawler = new Spido(url, { internalLinks: false, sitemap: false });

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

    console.log(crawler.options);
    await crawler.crawl().then(() => {
      const seoData = crawler.websiteSeoData;
      console.log(seoData);
    });
  });

program
  .command("fetch")
  .argument("<url>", "the url you'd like to fetch")
  .description("fetch seo data from url")
  .action(async (url: string) => {
    const crawler = new Spido(url, {});
    const data = await crawler.fetch(url);
    console.log(data);
  });

program
  .command("sitemap")
  .argument("<url>", "the url of website you'd like to generate sitemap for")
  .option("-p <path>", "the path to save sitemap to")
  .description("generate sitemap for website")
  .action(async (url: string, options: any) => {
    console.log(url, options.p);
    if (!options.p) {
      const sitemap = await utils.sitemapGenerator(url, "");
      console.log(sitemap);
    } else if (options.p) {
      const sitemap = await utils.sitemapGenerator(url, options.p);
      console.log(sitemap);
    }
  });

program.parse(process.argv);
