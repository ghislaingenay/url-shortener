import { UrlCached, countCache } from "./UrlCached";
import { UrlDB } from "./UrlDB";
import { Url, UrlValidator } from "./UrlValidator";

type GetLongUrl =
  | { mode: "id"; id: number; shortUrl?: undefined }
  | { mode: "url"; shortUrl: string; id?: undefined };

export class URLShortener {
  private ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 62 characters
  private charCount = this.ALPHABET.length;
  private urlCache: UrlCached;
  constructor() {
    this.urlCache = countCache;
  }

  idToShortURL = (id: number): string => {
    let shortURL = "";
    while (id > 0) {
      shortURL = this.ALPHABET[id % this.charCount] + shortURL;
      id = Math.floor(id / this.charCount);
    }
    return shortURL;
  };

  shortURLToID = (shortURL: string): number => {
    let id = 0;
    for (let i = 0; i < shortURL.length; i++) {
      id = id * this.charCount + this.ALPHABET.indexOf(shortURL[i]);
    }
    return id;
  };

  createURL = (longUrl: string): string => {
    // Initialize db
    const db = new UrlDB();
    // Validate url
    // Create short url
    const currentId = this.urlCache.currentId;
    const shortUrl = this.idToShortURL(currentId);
    // Prepare url data
    const data: Url = {
      shortUrl,
      longUrl,
      createdAt: new Date(),
      requested: 0,
      id: currentId,
    };
    // Validate url
    const validator = new UrlValidator(data);
    const sanitizedData = validator
      .isString(["longUrl"], { max: 2048, min: 1, isRequired: true })
      .isNumber(["id"], { isRequired: true })
      .isDate(["createdAt"], { isRequired: true })
      .isNumber(["requested"], { isRequired: true })
      .isString(["shortUrl"], {
        max: 10,
        min: 1,
      })
      .validate().data;

    db.saveUrl(sanitizedData);
    return shortUrl;
  };

  initDb = () => {
    return new UrlDB();
  };

  getLongUrl({ shortUrl, mode, id }: GetLongUrl): string {
    if (mode === "id") return this.getLongUrlByShortId(id);
    return this.getLongUrlByShortUrl(shortUrl);
  }

  private getAllUrls = (): Url[] => {
    const db = this.initDb();
    return db.getAllUrls();
  };

  private getLongUrlByShortUrl = (shortUrl: string): string => {
    const urls = this.getAllUrls();
    const url = urls.find((url) => url.shortUrl === shortUrl);
    if (!url) throw new Error("Url not found");
    return url.longUrl;
  };
  private getLongUrlByShortId = (id: number): string => {
    const urls = this.getAllUrls();
    const url = urls.find((url) => url.id === id);
    if (!url) throw new Error("Url not found");
    return url.longUrl;
  };
}
