const Spido = require("../lib/crawler");

const url = "https://www.scandinaviatech.com";
const c = new Spido(url);

const response = c.fetch(url);

console.log(response);
