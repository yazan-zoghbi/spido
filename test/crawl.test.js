const Spido = require("../lib/crawler");

const url = "https://www.google.com";
const c = new Spido(url);

const response = c.crawl(url);

console.log(response);
