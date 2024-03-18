import fs from "fs";

export class FileExplorer {
  static isPathValid(path: string): boolean {
    return fs.existsSync(path);
  }

  static readSync(path: string): string {
    return fs.readFileSync(path, "utf8");
  }
}
