const Spido = require("../lib/crawler");

//define fetch terminal command line argument and if it's provided use crawler fetch method
//define url argument name -u and if it's provided use crawler crawl method

const urlArg = process.argv[2] === "-u";
const url = process.argv[urlArg ? 3 : 2];
console.log(urlArg + ": " + url);
if (urlArg && url) {
  const c = new Spido(url);
  const response = c.fetch(url);
  response.then((data) => {
    console.log(data);
  });
} else {
  console.log("invalid arguments! please consider using -u <url>");
}