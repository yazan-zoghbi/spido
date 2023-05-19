## Version 1.5.0

### Features Added

- Implemented new depth limit.
- Added new features and types:
  - `CacheEntry` interface to define cache object type.
  - `Cache` type.
  - New crawling mechanism with in-memory cache logic.
  - Private `handleResponse` function to process each URL response.
  - Private `enqueueURLs` function to add discovered URLs to the queue.
  - `HttpResponse` type with document data and response URL.
  - Status code for fetched URLs.

### Improvements

- Refactored `Spido` Crawler class and imported interfaces:
  - Improved code organization and readability.
  - Added `Utils` class to `index.ts` entry point.
  - Moved import statements for interfaces to the main file.
  - Replaced `CacheEntry` interface with `CachedEntry`.
  - Updated `Cache` type definition to use `CachedEntry` interface.
  - Renamed `options` parameter in the constructor to `CrawlerOptions`.
  - Moved instantiation of `Utils` class to the constructor.
  - Replaced `isValidUrl` function call with `utils.isValidUrl` method call.
  - Updated `fetch` method to use `utils.getSeoDataFromResponse` method.
  - Replaced `HttpResponse` type with `HttpResponse` interface in `handleResponse` method.
  - Renamed `internalLinksEnabled` method to `enqueueInternalLinks`.
  - Updated `enqueueInternalLinks` method to use `utils.isValidUrl` method.
  - Fixed access modifiers of class members to private where appropriate.

These changes improve the structure and maintainability of the Spido Crawler module. The imported interfaces provide better type checking and clarity for the codebase.

---

## Version 1.4.3

### Features Added

- heading tags can now be extracted from html pages with getHeadings(url).

### Improvements

- JsDoc added to all utils functions, it should be easier now for developers to understand how features / functions would works

---

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
