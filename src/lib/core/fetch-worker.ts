// import worker thread

const { parentPort } = require("worker_threads");
import { Spido } from "./crawler";

parentPort.on("message", async (url: string, data: object) => {
  data = await getFetch(url);
  console.log("fetching base url in worker thread: " + url);
  parentPort.postMessage({ url: url, data: data });
});

async function getFetch(url: string): Promise<object> {
  const crawler = new Spido(url, {});
  const data = await crawler.getSeoData(url);
  return data;
}
