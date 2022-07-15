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


axios.defaults.headers.get = { "User-Agent": "Axios 0.21.1" };

//get hostname from header of url & add https:// to the url if it's not present
export const getHostname = (url: string) => {
  if (!url) {
    throw new Error("url not defined");
  }
  const hostname = url.split("/")[2];
  return hostname.replace("www.", "");
};

//get base url from hostname
export const getBaseUrl = (url: string) => {
  const hostname = getHostname(url);
  return `https://${hostname}`;
};

//get path name base url
export const getPath = async (url: string) => {
  const baseUrl = getBaseUrl(url);
  const path = baseUrl.replace(baseUrl, "/");
  return path;
};

//check if url is valid & response is ok
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

//get sitemap url
export const getSitemap = async (url: string) => {
  const baseUrl = getBaseUrl(url);
  return `${baseUrl}/sitemap.xml`;
};

//check if sitemap url is valid & response is 200
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

//get the html from the url using axios & handle errors if any
export const getHTML = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

//get links from website sitemap
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

//get seo data from html
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

//get the links from the html & add hostname to the url if it's not present
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

//get internal links array
export const getInternalLinks = async (url: string, html: any) => {
  const baseUrl = getBaseUrl(url);
  const links = await getLinks(url, html);
  const internalLinks = links.filter((link) => link.startsWith(baseUrl));
  //remove duplicates from the array
  const uniqueLinks = [...new Set(internalLinks)];
  return uniqueLinks;
};

//get external links only
export const getExternalLinks = async (url: string, html: any) => {
  const links = getLinks(url, html);
  const externalLinks = (await links).filter(
    (link: string) => !link.startsWith(url)
  );
  return externalLinks;
};

//getting seo data from url
export const getSeoData = async (url: string) => {
  if (url) {
    const html = await getHTML(url);
    const seoData = getSeoDataFromHTML(html, url);
    return seoData;
  }
};

export const sitemapGenerator = async (url: string, path: string) => {
  const sitemapLinksSet = await xmlSiteMapGenerator.sitemapLinksGenerator(url);
  const sitemap = await xmlSiteMapGenerator.addLinksToXML(sitemapLinksSet);
  const file = await xmlSiteMapGenerator.writeSitemap(sitemap, path);

  return file;
};
