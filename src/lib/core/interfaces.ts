import { AxiosResponse } from "axios";

/**
 * Represents cached data for a URL.
 */
export interface CachedEntry {
  response: HttpResponse;
  internalLinks: string[];
  isValid: boolean;
  pathDepth: number;
}

/**
 * Represents options for the crawler.
 */
export interface CrawlerOptions {
  internalLinks: boolean;
  sitemap: boolean;
  depth: number;
}

/**
 * Represents the in-memory cache.
 */
export interface Cache {
  [url: string]: CachedEntry;
}

/**
 * Represents metadata for a URL.
 */
export interface Metadata {
  url: string;
  title: string;
  description: string | undefined;
  canonical: string | undefined;
  robots: string | undefined;
  links: number;
  status: number;
}

/**
 * Represents an image.
 */
export interface Image {
  alt: string;
  src: string;
}

/**
 * Represents an HTTP response.
 */
export interface HttpResponse {
  response: AxiosResponse;
  responseURL: string;
}
