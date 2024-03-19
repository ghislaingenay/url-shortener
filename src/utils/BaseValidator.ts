/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */

type CheckTextOptions = {
  max?: number;
  isRequired?: boolean;
  min?: number;
};

type KeyOf<T> = keyof T;

export class BaseValidator<T> {
  private _data: T;
  private _history: string[] = [];
  private format = /^\d{4}-\d{2}-\d{2}/;
  private isValidated = false;

  private initialize() {
    this._history.push("init");
  }
  constructor(data: T) {
    if (typeof data !== "object" || data === null) {
      throw new TypeError("Data must be an object");
    }
    this._data = data;
    this.initialize();
  }

  private getValueByKey(key: KeyOf<T>): any {
    if (this._data[key] === null || this._data[key] === undefined)
      throw new TypeError(`Data is not defined for ${key.toString()}`);
    return this._data[key] as unknown as any;
  }

  get data(): T {
    if (!this.isValidated)
      throw new SyntaxError(
        "Needs to call .validate() method just before .data"
      );
    const [start] = this._history;
    const end = this._history.slice(-1)[0];
    if (this._data === null) throw new TypeError("Data is not defined");
    if (start !== "init" && end !== "validate")
      throw new SyntaxError("Forgot to init and validate the data");
    return this._data;
  }

  private isTypeNumber(value: any): boolean {
    return typeof value === "number";
  }

  private isDefined(value: any) {
    return value !== null && value !== undefined;
  }

  /////////// STRING //////////////
  isString(key: Array<KeyOf<T>>, options?: CheckTextOptions): BaseValidator<T> {
    this._history.push("isString");
    const { max, min, isRequired } = options || {};
    const required = isRequired || true;
    const keyList = Array.isArray(key) ? key : [key];
    if (max && !this.isTypeNumber(max))
      throw new TypeError("max should be a number");
    if (min && !this.isTypeNumber(min))
      throw new TypeError("min should be a number");
    if (max && min && max < min)
      throw new TypeError("max should be greater than min");
    keyList.forEach((k) => {
      const value = this.getValueByKey(k) as string;
      if (value && typeof value !== "string")
        throw new Error(`${String(k)} should be a string`);
      if (!required && !this.isDefined(value)) return;
      if (required && !this.isDefined(value))
        throw new Error(`${String(key)} is required`);
      if (max && value.length > max)
        throw new Error(`${String(key)} should not exceed ${max} characters`);
      if (min && value.length < min)
        throw new Error(
          `${String(key)} should have at least ${min} characters`
        );
    });
    return this;
  }

  //////////////// NUMBER ////////////////
  isNumber(
    key: Array<KeyOf<T>>,
    options?: { isRequired?: boolean }
  ): BaseValidator<T> {
    this._history.push("isNumber");
    const { isRequired } = options || {};
    const required = isRequired || true;
    const keyList = Array.isArray(key) ? key : [key];
    keyList.forEach((k) => {
      const value = this.getValueByKey(k) as number;
      if (value && typeof value !== "number")
        throw new Error(`${String(k)} should be a number`);
      if (required && !this.isDefined(value))
        throw new Error(`${String(key)} is required`);
    });
    return this;
  }

  ///////////// BOOLEAN - TINYINT ////////////////
  isBoolean(
    key: Array<KeyOf<T>>,
    options?: { isRequired?: boolean }
  ): BaseValidator<T> {
    this._history.push("isBoolean");
    const { isRequired } = options || {};
    const required = isRequired || true;
    const keyList = Array.isArray(key) ? key : [key];
    keyList.forEach((k) => {
      const value = this.getValueByKey(k) as boolean;
      if (value && typeof value !== "boolean")
        throw new Error(`${String(k)} should be a boolean`);
      if (required && !this.isDefined(value))
        throw new Error(`${String(key)} is required`);
    });
    return this;
  }

  isTinyin(
    key: Array<KeyOf<T>>,
    options?: { isRequired?: boolean }
  ): BaseValidator<T> {
    this._history.push("isTinyin");
    const { isRequired } = options || {};
    const required = isRequired || true;
    const keyList = Array.isArray(key) ? key : [key];
    keyList.forEach((k) => {
      const value = this.getValueByKey(k) as any;
      if (value && typeof value !== "string")
        throw new Error(`${String(k)} should be a string`);
      if (required && !this.isDefined(value))
        throw new Error(`${String(key)} is required`);
      if (value !== 0 || value !== 1)
        throw new Error(`${String(key)} should be 0 or 1`);
    });
    return this;
  }
  /////////////////// DATE /////////////////

  private getDateTime(date: string | Date = new Date()): number {
    return new Date(date).getTime();
  }

  private isDateDefined([...keys]: KeyOf<T>[], format?: RegExp): boolean {
    keys.forEach((key) => {
      if (!key) throw new TypeError(`${key.toString()} is not defined`);
      const value = this.getValueByKey(key);
      if (!value)
        throw new TypeError(`Value for ${key.toString()} is not defined`);
      const chosenFormat = format || this.format;
      if (!chosenFormat.test(value as string))
        throw new TypeError(
          `${key.toString()} should be a date. Format: ${format}. Got ${value}`
        );
    });
    return true;
  }

  isDate(
    key: Array<KeyOf<T>>,
    options?: { isRequired?: boolean }
  ): BaseValidator<T> {
    this._history.push("isDate");
    const { isRequired } = options || {};
    const required = isRequired || true;
    const keyList = Array.isArray(key) ? key : [key];
    keyList.forEach((k) => {
      const value = this.getValueByKey(k) as Date;
      if (value && !(value instanceof Date))
        throw new TypeError(`${String(k)} should be a Date`);
      if (required && !this.isDefined(value))
        throw new TypeError(`${String(key)} is required`);
    });
    return this;
  }

  isDateAfter(dateKey: KeyOf<T>, comparedDateKey: KeyOf<T>): BaseValidator<T> {
    this._history.push("isDateAfter");
    this.isDateDefined([dateKey, comparedDateKey]);
    const isDateAfter =
      this.getDateTime(dateKey as string) >
      this.getDateTime(comparedDateKey as string);
    if (!isDateAfter)
      throw new Error(
        `${dateKey.toString()} should be after ${comparedDateKey.toString()}`
      );
    return this;
  }

  isDateBefore(dateKey: KeyOf<T>, comparedDateKey: KeyOf<T>): BaseValidator<T> {
    this._history.push("isDateBefore");
    this.isDateDefined([dateKey, comparedDateKey]);
    const isDateBefore =
      this.getDateTime(dateKey as string) <
      this.getDateTime(comparedDateKey as string);
    if (!isDateBefore)
      throw new Error(
        `${dateKey.toString()} should be before ${comparedDateKey.toString()}`
      );
    return this;
  }

  isDateSame(
    dateKey: KeyOf<T>,
    comparedDateKey: KeyOf<T>,
    msLimit = 1000
  ): BaseValidator<T> {
    this._history.push("isDateSame");
    this.isDateDefined([dateKey, comparedDateKey]);
    const dateDiff =
      this.getDateTime(comparedDateKey as string) -
      this.getDateTime(dateKey as string);
    if (dateDiff > msLimit)
      throw new Error(
        `${dateKey.toString()} should be the same as ${comparedDateKey.toString()}`
      );
    return this;
  }

  /////////// ENUM //////////////
  isEnum(key: KeyOf<T>, enumList: string[]): BaseValidator<T> {
    this._history.push("isEnum");
    const value = this.getValueByKey(key) as string;
    if (!enumList.includes(value))
      throw new Error(`${String(key)} should be one of ${enumList.join(", ")}`);
    return this;
  }

  isNotNull(key: Array<KeyOf<T>>): BaseValidator<T> {
    this._history.push("isNotNull");
    const keyList = Array.isArray(key) ? key : [key];
    keyList.forEach((k) => {
      const value = this.getValueByKey(k);
      if (!this.isDefined(value))
        throw new Error(`${String(key)} should not be null`);
    });
    return this;
  }

  //////////////// OTHERS ////////////////////////
  shouldContainKey(key: KeyOf<T>): BaseValidator<T> {
    this._history.push("shouldContainKeys");
    const value = this.getValueByKey(key);
    if (!this.isDefined(value))
      throw new Error(`${String(key)} should be defined`);
    return this;
  }

  shouldNotContainKey(key: KeyOf<T>): BaseValidator<T> {
    this._history.push("shouldNotContainKeys");
    const value = this._data[key];
    if (value) throw new Error(`${String(key)} should not be defined`);
    return this;
  }

  ///////////////// VALIDATION ////////////////////

  validate(): BaseValidator<T> {
    this._history.push("validate");
    this.isValidated = true;
    return this;
  }

  ////////////// HELPERS //////////////////////0
  do(
    name: string,
    fn: () => Promise<{ result: boolean; message: string }>
  ): Promise<BaseValidator<T>> {
    this._history.push(`do_${name}`);
    return new Promise(async (resolve, reject) => {
      const response = await fn();
      const { message, result } = response;
      if (!result) reject(new Error(`${name}: ${message}`));
      resolve(this);
    });
  }
}
