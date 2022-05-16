/**
 * this files will include all utilities functions
 */

const xmlSiteMapGenerator = require("../xml-sitemap-generator.cjs");

module.exports = {
  sitemapGenerator: async (url: string, path: string) => {
    const sitemapLinksSet = await xmlSiteMapGenerator.sitemapLinksGenerator(
      url
    );
    const sitemap = await xmlSiteMapGenerator.addLinksToXML(sitemapLinksSet);
    const file = await xmlSiteMapGenerator.writeSitemap(sitemap, path);

    return file;
  },
};
