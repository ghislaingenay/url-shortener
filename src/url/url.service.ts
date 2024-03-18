import { GetLongUrl, URLShortener } from "./UrlShortener";

export class UrlService {
  URLShortener: URLShortener;
  constructor() {
    this.URLShortener = new URLShortener();
  }

  async createShortUrl(longUrl: string): Promise<string> {
    return this.URLShortener.createURL(longUrl);
  }

  async getLongUrl(shortUrl: GetLongUrl): Promise<string> {
    return this.URLShortener.getLongUrl(shortUrl);
  }
}
