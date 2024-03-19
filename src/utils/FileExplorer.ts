import fs from "fs";
import path from "path";

export class FileExplorer {
  pathname: string;
  constructor(link: string) {
    this.pathname = FileExplorer.joinPath(process.cwd(), link);
  }

  get path(): string {
    return this.pathname;
  }

  static joinPath(...paths: string[]): string {
    return path.join(...paths);
  }

  static isPathValid(link: string): boolean {
    const completePath = FileExplorer.joinPath(process.cwd(), link);
    return fs.existsSync(completePath);
  }

  static readSync(link: string): string {
    return fs.readFileSync(path.join(process.cwd(), link), "utf8");
  }
}
