import { BaseValidator } from "./BaseValidator";

interface Url {
  shortUrl: string;
  longUrl: string;
  createdAt: Date;
  requested: number;
  id: number;
}

export type { Url };

export class UrlValidator extends BaseValidator<Url> {
  constructor(data: Url) {
    super(data);
  }
}
