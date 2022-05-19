import fs from "fs";
import Spido from "..";
import xmlFormatter from "xml-formatter";

// xml sitemap generator using crawler.cjs
export const sitemapLinksGenerator = async (url: string) => {
  const crawler = new Spido(url, {});
  const html = await crawler.getHTML(url);
  const internalLinks = await crawler.getInternalLinks(html);

  const sitemap = internalLinks.map((link: string) => {
    return `<url><loc>${link}</loc></url>`;
  });

  return sitemap;
};

// convert sitemapGenerator to xml
export const addLinksToXML = async (sitemap: any) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap.join("\n")}
    </urlset>`;

  const formattedXML = xmlFormatter(xml);

  return formattedXML;
};

// write sitemap to file
export const writeSitemap = async (xml: any, path: string) => {
  const file = "sitemap.xml";

  //write file to current directory or any other directory
  //if user want to write file to another directory then change the path

  if (!path) {
    fs.writeFile(file, xml, (err: any) => {
      if (err) throw err;
      console.log("Sitemap generated successfully");
    });
    return file;
  } else if (path) {
    console.log(path);
    fs.writeFile(`${path}${file}`, xml, (err: any) => {
      if (err) throw err;
      console.log("Sitemap generated successfully");
    });

    return path + file;
  }
};
