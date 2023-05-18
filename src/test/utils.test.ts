import { Utils } from "../lib/core/utils";

jest.setTimeout(30000);

describe("Utils", () => {
  let utils: Utils;

  beforeEach(() => {
    utils = new Utils();
  });

  describe("getResponse", () => {
    it("should retrieve the response for a valid URL", async () => {
      const url = "https://example.com/";
      const response = await utils.getResponse(url);

      expect(response).toBeDefined();
      expect(response.response).toBeDefined();
    });

    it("should throw an error for an invalid URL", async () => {
      const invalidUrl = "https://invalid-url";

      await expect(utils.getResponse(invalidUrl)).rejects.toThrowError(
        `Error retrieving response for URL: ${invalidUrl}`
      );
    });
  });

  describe("getBaseUrl", () => {
    it("should retrieve the base URL for a valid URL", async () => {
      const url = "https://www.google.com/imghp";
      const baseUrl = await utils.getBaseUrl(url);

      expect(baseUrl).toBe("https://www.google.com");
    });

    it("should throw an error for an invalid URL", async () => {
      const invalidUrl = "https://invalid-url";

      await expect(utils.getBaseUrl(invalidUrl)).rejects.toThrowError(
        `Invalid URL! - ${invalidUrl}`
      );
    });
  });
});
