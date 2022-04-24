const dotenv = require("dotenv").config();
const { test } = require("@jest/globals");
const path = require("path");
const exec = require("child_process").exec;

const URL = process.env.URL;
jest.setTimeout(60000);

//test cli - crawling process with default options
test("crawling process with default options", async () => {
  const output = await cli("crawl", "-i");
  expect(output).toMatch("crawling internal links...");
});

//test cli - crawling process with sitemap enabled
test("crawling process with sitemap enabled", async () => {
  const output = await cli("crawl", "-s");
  expect(output).toMatch("crawling sitemap...");
});

//test cli - fetching data from url
test("fetching data from url", async () => {
  const output = await cli("fetch");
  expect(output).toMatch("title");
  expect(output).toMatch("description");
  expect(output).toMatch("canonical");
  expect(output).toMatch("robots");
  expect(output).toMatch("links");
});

function cli(args, options) {
  const command = `node ${path.resolve(
    __dirname,
    "../cli/index.cjs"
  )} ${args} ${URL} ${options}`;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}
