import fs from "fs";
export class FileExplorer {
  static isPathValid(path: string): boolean {
    return fs.existsSync(path);
  }
}
