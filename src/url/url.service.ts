import { URLShortener } from "./UrlShortener";

export class UrlService {
  URLShortener: URLShortener;
  constructor() {
    this.URLShortener = new URLShortener();
  }

  async createShortUrl(longUrl: string): Promise<string> {
    return this.URLShortener.createURL(longUrl);
  }

  async getLongUrl(shortUrl: GetLo): Promise<string> {
    return this.URLShortener.getLongUrl(shortUrl);
  }
}
