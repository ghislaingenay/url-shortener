import fs from "fs";
import { FileExplorer } from "../utils/FileExplorer";
import { UrlCached, countCache } from "./UrlCached";
import { Url } from "./UrlValidator";

export class UrlDB {
  private urlCache: UrlCached;
  FILENAME = "url.json";
  constructor() {
    this.urlCache = countCache;
  }

  getAllUrls = (): Url[] => {
    if (FileExplorer.isPathValid(this.FILENAME) === false)
      throw new Error("File not found");
    const value = fs.readFileSync(this.FILENAME, "utf8");
    return JSON.parse(value);
  };

  saveUrl(data: Url) {
    const results = this.getAllUrls();
    fs.writeFileSync(this.FILENAME, JSON.stringify([...results, data]), "utf8");
    this.urlCache.updateCount();
    return data;
  }

  incrementRequestCount(shortUrl: string) {
    const results = this.getAllUrls();
    const currentData = results.find((data) => data.shortUrl === shortUrl);
    if (!currentData) throw new Error("Data not found");
    const dataUrls = results.map((data) => {
      if (data.shortUrl !== shortUrl) return data;
      return { ...data, requested: data.requested + 1 };
    });
    fs.writeFileSync(this.FILENAME, JSON.stringify(dataUrls), "utf8");
    return currentData;
  }
}
