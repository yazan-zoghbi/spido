import axios, { AxiosError, AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { HttpResponse, Image, Metadata } from "./interfaces";

export class Utils {
  /**
   * Retrieves the HTML from a specified URL using Axios.
   * @async
   * @function
   * @param {string} url - The URL to retrieve the HTML from.
   * @returns {Promise<HttpResponse>} - A Promise that resolves to an object containing the response and the response URL.
   * @throws {Error} - If there is an error with the Axios request, an error will be thrown.
   */
  getResponse = async (url: string): Promise<HttpResponse | undefined> => {
    try {
      const response = await axios.get(url);
      const responseURL = response.request.res.responseUrl;

      if (response.status >= 200 && response.status < 400) {
        return { response, responseURL };
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const response = error.response;
        const responseURL = response?.request.res.responseUrl;

        return { response, responseURL };
      } else {
        throw new Error(`Invalid URL! - ${url}`);
      }
    }
  };

  /**
   * Extracts the base URL from a given URL.
   * @param {string} url - The URL to extract the base URL from.
   * @returns {Promise<string>} - The base URL of the URL.
   * @throws {Error} - If the URL is invalid or the response status is not valid.
   */
  getBaseUrl = async (url: string): Promise<string> => {
    try {
      const response = await this.getResponse(url);
      if (!response) {
        throw new Error(`Invalid URL! - ${url}`);
      }

      const responseURL = response.responseURL;

      if (response.response.status >= 200 && response.response.status < 400) {
        // If the response status is valid, return the base URL
        return new URL(responseURL).origin;
      } else {
        // If the response status is not valid, throw an error
        throw new Error(`Invalid URL! - ${url}`);
      }
    } catch (err) {
      throw new Error(`Invalid URL! - ${url}`);
    }
  };

  /**
   * Checks if the given URL is valid and the response is OK.
   * @param {number} status - The status code of the response to be checked.
   * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the URL is valid and the response is OK.
   * @example
   * isValidUrl(200)
   *   .then(valid => console.log(valid)); // returns true or false
   */
  isValidUrl = async (status: number): Promise<boolean> => {
    try {
      if (status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status) {
        const status = error.response.status;

        if ([300, 301, 302, 303, 304, 305, 306, 307, 308].includes(status)) {
          try {
            const response = await axios.get(error.response.headers.location);

            if (response.status === 200) {
              return true;
            } else {
              return false;
            }
          } catch {
            return false;
          }
        }
      }
      return false;
    }
  };

  /**
   * Retrieves the sitemap URL of a given URL.
   * @async
   * @param {string} url - The URL to retrieve the sitemap URL from.
   * @returns {Promise<string>} - A Promise that resolves to the sitemap URL.
   */
  getSitemap = async (url: string): Promise<string> => {
    const baseUrl = await this.getBaseUrl(url);
    const sitemap = `${baseUrl}sitemap.xml`;
    return sitemap;
  };

  /**
   * Checks if the sitemap URL is valid and the response is 200.
   * @async
   * @param {string} url - The sitemap URL to check.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the sitemap URL is valid and the response is 200, otherwise false.
   */
  isSitemap = async (url: string): Promise<boolean> => {
    try {
      const sitemapUrl = await this.getSitemap(url);
      const httpResponse = await this.getResponse(sitemapUrl);

      if (!httpResponse) {
        throw new Error(`Invalid response! - ${url}`);
      }

      return httpResponse.response.status === 200;
    } catch (error) {
      return false;
    }
  };

  /**
   * Retrieves links from a website sitemap.
   * @async
   * @function
   * @param {string} url - The URL of the website.
   * @returns {Promise<string[]>} - A Promise that resolves to an array of unique links from the sitemap.
   */
  getLinksFromSitemap = async (url: string): Promise<string[]> => {
    const sitemapUrl = await this.getSitemap(url);
    const response = await this.getResponse(sitemapUrl);

    if (!response) {
      throw new Error(`Invalid response! - ${url}`);
    }

    const responseData = response.response.data;
    const $ = cheerio.load(responseData);
    const links: string[] = [];
    $("loc").each((i: number, link: cheerio.Element) => {
      links.push($(link).text());
    });

    const uniqueLinks = [...new Set(links)];
    return uniqueLinks;
  };

  /**
   * Retrieves SEO data from the HTML source code.
   * @async
   * @function
   * @param {AxiosResponse} response - The Axios response containing the HTML source code.
   * @param {string} url - The URL of the HTML source code.
   * @returns {Promise<Metadata>} - A Promise that resolves to an object containing SEO data extracted from the HTML source code.
   * @throws {Error} - If an error occurs while processing the HTML source code.
   * @typedef {Object} Metadata
   */
  getSeoDataFromResponse = async (
    response: AxiosResponse,
    url: string
  ): Promise<Metadata> => {
    const $ = cheerio.load(response.data);
    const seoData: Metadata = {
      url: url.toString(),
      title: $("title").text(),
      description: $("meta[name='description']").attr("content"),
      canonical: $("link[rel='canonical']").attr("href"),
      robots: $("meta[name='robots']").attr("content"),
      links: (await this.getLinks(url, response)).length,
      status: response.status,
    };

    return seoData;
  };

  /**
   * Retrieves all the links from the HTML content of a webpage.
   * @async
   * @function
   * @param {string} url - The URL of the webpage to be crawled.
   * @param {AxiosResponse} response - The Axios response containing the HTML content of the webpage.
   * @returns {Promise<string[]>} - A Promise that resolves to an array of links extracted from the HTML content.
   * The links are normalized to include the hostname if they are relative URLs.
   */
  getLinks = async (
    url: string,
    response: AxiosResponse
  ): Promise<string[]> => {
    const $ = cheerio.load(response.data);
    const baseUrl = url;

    const links: string[] = [];
    $("a").each((i: any, link: any) => {
      const href = $(link).attr("href");
      if (href) {
        // If the link is not a relative URL
        if (href.startsWith(baseUrl)) {
          links.push(href);
        }
        // If the link is a relative URL
        else if (href.startsWith("/")) {
          links.push(`${baseUrl}${href}`);
        }
        // Push every remaining link
        else {
          links.push(href);
        }
      }
    });

    return links;
  };

  /**
   * Extracts internal links from the given HTML document.
   * @async
   * @function
   * @param {HttpResponse} response - The HTTP response containing the HTML document.
   * @returns {Promise<string[]>} - A Promise that resolves to an array of internal links extracted from the HTML document.
   */
  getInternalLinks = async (response: HttpResponse): Promise<string[]> => {
    const responseURL = new URL(response.responseURL).origin;

    const links = await this.getLinks(responseURL, response.response);

    const internalLinks = links.filter((link) => link.startsWith(responseURL));

    const uniqueLinks = [...new Set(internalLinks)];

    return uniqueLinks;
  };

  /**
   * Extracts external links from the given HTML response.
   * @async
   * @function
   * @param {HttpResponse} response - The HTTP response containing the HTML document.
   * @returns {Promise<string[]>} - A Promise that resolves to an array of external links extracted from the HTML document.
   */
  getExternalLinks = async (response: HttpResponse): Promise<string[]> => {
    const responseURL = new URL(response.responseURL).origin;

    const links = await this.getLinks(responseURL, response.response);

    const externalLinks = links.filter(
      (link: string) => !link.startsWith(responseURL)
    );

    return externalLinks;
  };

  /**
   * Extracts images from an HTML page.
   * @async
   * @function
   * @param {string} url - The URL of the HTML page to extract images from.
   * @returns {Promise<Image[]>} - A Promise that resolves to an array of objects representing images in the HTML page. Each object has an `alt` property representing the alternative text of the image and a `src` property representing the source URL of the image.
   */
  getImages = async (url: string): Promise<Image[]> => {
    const response = await this.getResponse(url);
    const responseData = response?.response.data;
    const images: Image[] = [];
    const $ = cheerio.load(responseData);

    $("img").each((i, element) => {
      const alt = $(element).attr("alt") || "";
      const src = $(element).attr("src");
      if (src) {
        images.push({ alt, src });
      }
    });

    return images;
  };

  /**
   * Extracts headings from an HTML page.
   * @async
   * @function
   * @param {string} url - The URL of the HTML page to extract headings from.
   * @returns {Promise<Array<{ tag: string, text: string }>>} - A Promise that resolves to an array of objects representing headings in the HTML page. Each object has a `tag` property representing the heading tag (e.g., 'h1', 'h2', etc.) and a `text` property representing the text content of the heading.
   */
  getHeadings = async (
    url: string
  ): Promise<Array<{ tag: string; text: string }>> => {
    const response = await this.getResponse(url);
    const responseData = response?.response.data;
    const headings: Array<{ tag: string; text: string }> = [];
    const $ = cheerio.load(responseData);

    $("h1, h2, h3, h4, h5, h6").each((i, element) => {
      headings.push({
        tag: element.name,
        text: $(element).text(),
      });
    });

    return headings;
  };

  /**
   * Get the depth of a URL based on its subfolders.
   * @function
   * @param {string} url - The URL to get the depth from.
   * @returns {number} - The number of subfolders in the URL.
   */
  getUrlPathDepth = (url_param: string): number => {
    const url = new URL(url_param);

    let path = url.pathname;
    if (path.endsWith("/") && path !== "/") {
      path = path.slice(0, -1);
    }

    const levels = (path.match(/\//g) || []).length;
    return levels;
  };
}

module.exports = { Utils: Utils };
