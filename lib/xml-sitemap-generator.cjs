const fs = require("fs");
const Spido = require("..");
const xmlFormatter = require("xml-formatter");

// xml sitemap generator using crawler.cjs
const sitemapLinksGenerator = async (url) => {
  const crawler = new Spido(url);
  const html = await crawler.getHTML(url);
  const internalLinks = await crawler.getInternalLinks(html);

  const sitemap = internalLinks.map((link) => {
    return `<url><loc>${link}</loc></url>`;
  });

  return sitemap;
};

// convert sitemapGenerator to xml
const addLinksToXML = async (sitemap) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap.join("\n")}
    </urlset>`;

  const formattedXML = xmlFormatter(xml);

  return formattedXML;
};

// write sitemap to file
const writeSitemap = async (xml, path) => {
  const file = "sitemap.xml";

  //write file to current directory or any other directory
  //if user want to write file to another directory then change the path

  if (!path) {
    fs.writeFile(file, xml, (err) => {
      if (err) throw err;
      console.log("Sitemap generated successfully");
    });
    return file;
  } else if (path) {
    console.log(path);
    fs.writeFile(`${path}${file}`, xml, (err) => {
      if (err) throw err;
      console.log("Sitemap generated successfully");
    });

    return path + file;
  }
};

//module export utils.cjs
module.exports = {
  sitemapLinksGenerator,
  addLinksToXML,
  writeSitemap,
};
