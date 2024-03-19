import { GetLongUrl, URLShortener } from "./UrlShortener";
import { Url } from "./UrlValidator";

export class UrlService {
  URLShortener: URLShortener;
  constructor() {
    this.URLShortener = new URLShortener();
  }

  async getAllUrls(): Promise<Url[]> {
    return this.URLShortener.getAllUrls();
  }

  async createShortUrl(longUrl: string): Promise<string> {
    return this.URLShortener.createURL(longUrl);
  }

  async getLongUrl(shortUrl: GetLongUrl): Promise<string> {
    return this.URLShortener.getLongUrl(shortUrl);
  }
}
