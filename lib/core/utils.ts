/**
 * this files will include all utilities functions
 */

import * as xmlSiteMapGenerator from "../xml-sitemap-generator";

export const sitemapGenerator = async (url: string, path: string) => {
  const sitemapLinksSet = await xmlSiteMapGenerator.sitemapLinksGenerator(url);
  const sitemap = await xmlSiteMapGenerator.addLinksToXML(sitemapLinksSet);
  const file = await xmlSiteMapGenerator.writeSitemap(sitemap, path);

  return file;
};
