# ** No Options Enabled **

## Why This Error Occurred?

This error occurred because you have not enabled any options.

Options are used to defined the behavior and to provide additional information to the crawler.

## Possible Solutions

You can let the crawler crawl the website with default options.

`const crawler = new Spido(url);`

Or you can enable the options you want.

`const crawler = new Spido(url, {sitemap: true, internalLinks: true} )`

The options might change in the future. or added new ones.
