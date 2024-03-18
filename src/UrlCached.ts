import fs from "fs";
import { FileExplorer } from "./FileExplorer";

type UrlCountRange = {
  max: number;
  min: number;
  count: number;
};

// DONE USING REDIS
export class UrlCached {
  LOT = 1000;
  FILE_NAME = "cache.json";

  // Related to count
  getUrlId(): UrlCountRange {
    if (FileExplorer.isPathValid(this.FILE_NAME) === false)
      throw new Error("File not found");

    const value = fs.readFileSync(this.FILE_NAME, "utf8");
    //   .split("\n")
    //   .map((value: string) => value.trim())
    //   .reduce((acc: UrlCountRange, value: string) => {
    //     const [key, val] = value.split("=");
    //     acc[key as keyof UrlCountRange] = Number(val);
    //     return acc;
    //   }, {} as UrlCountRange);
    return JSON.parse(value);
  }

  get currentId() {
    return this.getUrlId().count;
  }

  private updateMaxMinCount(countData?: UrlCountRange) {
    const data = countData || this.getUrlId();
    const [newMin, newMax] = [data.min + this.LOT, data.min + this.LOT * 2];
    fs.writeFileSync(
      this.FILE_NAME,
      JSON.stringify({
        count: newMin,
        max: newMax,
        min: newMin,
      }),
      "utf8"
    );
  }

  updateCount() {
    const countData = this.getUrlId();
    const newCount = this.currentId + 1;
    if (newCount > countData.max) this.updateMaxMinCount(countData);
    fs.writeFileSync(
      this.FILE_NAME,
      JSON.stringify({ ...this.getUrlId(), count: newCount }),
      "utf8"
    );
  }

  set cache(data: UrlCountRange) {
    fs.writeFileSync(this.FILE_NAME, JSON.stringify(data), "utf8");
  }
}

export const countCache = new UrlCached();
