import axios from "axios";
import cheerio from "cheerio";

import * as xmlSiteMapGenerator from "../xml-sitemap-generator";

// SEO DATA type
export type seoData = {
  url: string;
  title: string;
  description: string | undefined;
  canonical: string | undefined;
  robots: string | undefined;
  links: number;
};

// Image type
export interface Image {
  alt: string;
  src: string;
}

axios.defaults.headers.get = { "User-Agent": "Axios 0.21.1" };

/**

Extracts the hostname from a URL
@param {string} url - The URL to extract the hostname from
@returns {string} - The hostname of the URL
@throws {Error} - If the url parameter is not defined
*/
export const getHostname = (url: string) => {
  if (!url) {
  throw new Error("url not defined");
  }
  const hostname = url.split("/")[2];
  return hostname.replace("www.", "");
  };

  /**
  
  Extracts the base URL from a URL
  @param {string} url - The URL to extract the base URL from
  @returns {string} - The base URL of the URL
  */
  export const getBaseUrl = (url: string) => {
  const hostname = getHostname(url);
  return `https://${hostname}`;
  };

/**

Extracts the path from a URL
@param {string} url - The URL to extract the path from
@returns {string} - The path of the URL
*/
export const getPath = async (url: string) => {
  const baseUrl = getBaseUrl(url);
  const path = baseUrl.replace(baseUrl, "/");
  return path;
};

/**

@function isValidUrl
@async
@param {string} url - The URL to be checked.
@returns {Promise<boolean>} Returns a Promise that resolves to a boolean indicating whether the URL is valid and the response is OK.
@description
This function uses the Axios library to check if the given URL is valid and the response is OK. If the response is a redirect (status code 300-308), it will follow the redirect and check the status code of the redirected URL.
@example
isValidUrl('https://www.example.com')
.then(valid => console.log(valid)) // returns true or false
*/
export const isValidUrl = async (url: string) => {
  const validResponse = await axios
    .request({
      url,
      maxRedirects: 0,
    })
    .catch(async (error: any) => {
      if (
        error.response.status === 300 ||
        301 ||
        302 ||
        303 ||
        304 ||
        305 ||
        306 ||
        307 ||
        308
      ) {
        return await axios
          .get(error.response.headers.location)
          .then((response: any) => {
            if (response.status === 200) {
              return true;
            } else {
              return false;
            }
          });
      }
    });
  return validResponse;
};

/**

Returns the sitemap URL of a given URL.
@async
@function
@param {string} url - The URL to retrieve the sitemap URL from.
@returns {string} The sitemap URL.
*/
export const getSitemap = async (url: string) => {
  const baseUrl = getBaseUrl(url);
  return `${baseUrl}/sitemap.xml`;
};

/**

Check if sitemap URL is valid and response is 200
@async
@function isSitemap
@param {string} url - The sitemap URL to check
@returns {boolean} - Returns true if the sitemap URL is valid and response is 200, false otherwise
*/
export const isSitemap = async (url: string) => {
  const sitemapUrl = await getSitemap(url);
  return await axios
    .get(sitemapUrl)
    .then((response: any) => {
      return response.status === 200;
    })
    .catch(() => {
      return false;
    });
};

/**

Retrieve the HTML from a specified URL using Axios.
@async
@function
@param {string} url - The URL to retrieve the HTML from.
@returns {Promise<string>} The HTML data retrieved from the URL.
@throws {Error} If there is an error with the Axios request, the error will be thrown.
*/
export const getHTML = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

/**

Get links from a website sitemap.
@async
@function
@param {string} url - The URL of the website.
@returns {Promise} A Promise that resolves to an array of unique links from the sitemap.
*/
export const getLinksFromSitemap = async (url: string) => {
  const sitemapUrl = await getSitemap(url);
  const html = await getHTML(sitemapUrl);
  const $ = cheerio.load(html);
  const links: any[] = [];
  $("loc").each((i: any, link) => {
    links.push($(link).text());
  });

  const uniqueLinks = [...new Set(links)];
  return uniqueLinks;
};

/**

@function
@async
@param {any} html - the HTML source code to extract SEO data from.
@param {string} url - the URL of the HTML source code.
@returns {seoData} - an object containing SEO data extracted from the HTML source code.
@throws {Error} - if an error occurs while processing the HTML source code.
@typedef {Object} seoData
@property {string} url - the URL of the HTML source code.
@property {string} title - the title of the HTML source code.
@property {string} description - the description of the HTML source code.
@property {string} canonical - the canonical URL of the HTML source code.
@property {string} robots - the robots instructions of the HTML source code.
@property {number} links - the number of links in the HTML source code.
*/
export const getSeoDataFromHTML = async (html: any, url: string) => {
  const $ = cheerio.load(html);
  const seoData: seoData = {
    url: url.toString(),
    title: $("title").text(),
    description: $("meta[name='description']").attr("content"),
    canonical: $("link[rel='canonical']").attr("href"),
    robots: $("meta[name='robots']").attr("content"),
    links: (await getLinks(url, html)).length,
  };

  return seoData;
};

/**

@function
@async
@param {string} url - The URL of the webpage to be crawled.
@param {any} html - The HTML content of the webpage.
@returns {Array} links - An array of all the links in the HTML.
This function extracts all the links from an HTML content and adds the hostname to the URL if it's not present.
The links are returned as an array.
*/
export const getLinks = async (url: string, html: any) => {
  const $ = cheerio.load(html);
  const links: any[] = [];
  $("a").each((i: any, link: any) => {
    const href = $(link).attr("href");
    const hostname = getHostname(url);
    const baseUrl = getBaseUrl(url);

    //if the link is not a relative url
    if (href) {
      if (href.startsWith(baseUrl)) {
        links.push(href);
      }
      //if the link is relative url
      else if (href.startsWith("/")) {
        links.push(`${baseUrl}${href}`);
      }
    } else {
      links.push(hostname + "/" + href);
    }
  });
  return links;
};

/**
 * Extracts internal links from the given HTML
 * @param {string} url - The URL of the HTML document
 * @param {any} html - The HTML document as a string or an object
 * @returns {Array} - An array of internal links
 */
export const getInternalLinks = async (url: string, html: any) => {
  const baseUrl = getBaseUrl(url);
  const links = await getLinks(url, html);
  const internalLinks = links.filter((link) => link.startsWith(baseUrl));
  //remove duplicates from the array
  const uniqueLinks = [...new Set(internalLinks)];
  return uniqueLinks;
};

/**
 * Extracts external links from the given HTML
 * @param {string} url - The URL of the HTML document
 * @param {any} html - The HTML document as a string or an object
 * @returns {Array} - An array of external links
 */
export const getExternalLinks = async (url: string, html: any) => {
  const links = getLinks(url, html);
  const externalLinks = (await links).filter(
    (link: string) => !link.startsWith(url)
  );
  return externalLinks;
};

/**

This function is used to get SEO data from a given URL.
@function
@async
@param {string} url - The URL to retrieve SEO data from.
@returns {object} seoData - An object containing SEO data including the title, description, and keywords.
*/
export const getSeoData = async (url: string) => {
  if (url) {
    const html = await getHTML(url);
    const seoData = getSeoDataFromHTML(html, url);
    return seoData;
  }
};

/**

Generates a sitemap from a given URL and writes it to a file at a specified path
@param {string} url - The URL to generate the sitemap for
@param {string} path - The path to write the generated sitemap to
@returns {Promise<any>} - A promise that resolves to the file that was written to disk.
*/
export const sitemapGenerator = async (url: string, path: string) => {
  const sitemapLinksSet = await xmlSiteMapGenerator.sitemapLinksGenerator(url);
  const sitemap = await xmlSiteMapGenerator.addLinksToXML(sitemapLinksSet);
  const file = await xmlSiteMapGenerator.writeSitemap(sitemap, path);

  return file;
};

/**

Extract images from an HTML page
@param {string} url - The URL of the HTML page to extract images from
@returns {Promise<Image[]>} - A promise that resolves to an array of objects representing images in the HTML page. Each object has an alt property representing the alternative text of the image and a src property representing the source URL of the image.
*/
export const getImages = async (url: string): Promise<Image[]> => {
  const images: Image[] = [];
  const $ = cheerio.load(await getHTML(url));

  $("img").each((i, element) => {
    const alt = $(element).attr("alt") || "";
    const src = $(element).attr("src");
    if (src) {
      images.push({ alt: alt, src: src });
    }
  });

  return images;
};


/**

Extract headings from an HTML page
@param {string} url - The URL of the HTML page to extract headings from
@returns {Promise<Array<{ tag: string, text: string }>>} - A promise that resolves to an array of objects representing headings in the HTML page. Each object has a tag property representing the heading tag (e.g. 'h1', 'h2', etc.) and a text property representing the text content of the heading.
*/
export const getHeadings = async (url: string): Promise<Array<{ tag: string, text: string }>> => {
  const headings: Array<{ tag: string, text: string }> = [];
  const $ = cheerio.load(await getHTML(url));

  $("h1, h2, h3, h4, h5, h6").each((i, element) => {
    headings.push({
      tag: element.name,
      text: $(element).text(),
    });
  });

  return headings;
};


