## Version 1.4.2

### Features Added

- images now can be extracted from html pages with utils getImages(url).

### Improvements

- add image interface to ensure type safety

---

## Version 1.1.2

### Features Added

- define new options for control crawling process, like `sitemap` and `internal links`

### Improvements

- add new functions to get base url, path, hostname
- add jest framework for testing process

### Fixed bugs

- fix bug for detect internal links as absolute url and relative url
- fix bug for remove duplicated links from queue

---

## Version 1.1.0

### Features Added

- cli commands integration
- new argument `-u` for url
- new argument `-f` to fetch
- new argument `-c` to crawl

### Fixed bugs

- crawl internal links bug
- fetch bug
