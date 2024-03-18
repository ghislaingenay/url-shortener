import { BaseValidator } from "./BaseValidator";

interface Url {
  shortUrl: string;
  longUrl: string;
  createdAt: Date;
  requested: number;
  count: number;
}

export type { Url };

export class UrlValidation extends BaseValidator<Url> {
  constructor(data: Url) {
    super(data);
  }
}
