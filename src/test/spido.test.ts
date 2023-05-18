import { Spido } from "../lib/core/crawler";

jest.setTimeout(30000); // Increase the timeout to 10 seconds (or adjust as needed)

describe("Spido", () => {
  test("should crawl the website and return the SEO data", async () => {
    // Create an instance of Spido with mock dependencies
    const spido = new Spido("https://example.com");

    // Mock the methods or dependencies used within the crawl function
    const mockedQueueDequeue = jest.spyOn(spido.queue, "dequeue");
    mockedQueueDequeue.mockReturnValueOnce("https://example.com/page1");

    const mockedHandleResponse = jest.spyOn(spido, "handleResponse");
    mockedHandleResponse.mockResolvedValueOnce();

    // Call the crawl function and assert the expected result
    const seoData = await spido.crawl();

    // Assert the expected result
    expect(spido.visited.size).toBe(1);
    expect(spido.visited.has("https://example.com/page1")).toBe(true);
    expect(spido.websiteSeoData).toEqual(expect.any(Array));
    expect(seoData).toEqual(spido.websiteSeoData);
  });
});
