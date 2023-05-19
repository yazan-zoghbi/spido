import { Spido } from "../lib/core/crawler";

jest.setTimeout(30000);

describe("Spido", () => {
  test("should crawl the website and return the SEO data", async () => {
    // Create an instance of Spido with mock dependencies
    const spido = new Spido("https://example.com");

    // Call the crawl function and assert the expected result
    const seoData = await spido.crawl();

    // Assert the expected result
    expect(spido.visited.size).toBe(1);
    expect(spido.visited.has("https://example.com")).toBe(true);
    expect(spido.websiteSeoData).toEqual(expect.any(Array));
    expect(seoData).toEqual(spido.websiteSeoData);
  });
});
