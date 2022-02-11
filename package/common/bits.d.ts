declare type Label<T, U> = T | U | 'all';
declare type Labels<T, U> = readonly (T | U | 'all')[];
declare type BitsDic<T extends string, U extends string, X> = {
  [key in Label<T, U>]: X;
};
export declare class BitsData<T extends string, U extends string | never> {
  value: number;
  field: Bits<T, U>;
  is: BitsDic<T, U, boolean>;
  has: BitsDic<T, U, number>;
  constructor(value: number, field: Bits<T, U>);
  posi(...labels: Labels<T, U>): BitsData<T, U>;
  nega(...labels: Labels<T, U>): BitsData<T, U>;
  toggle(...labels: Labels<T, U>): BitsData<T, U>;
}
export declare class Bits<T extends string, U extends string> {
  labels: Labels<T, U>;
  mask: number;
  posi: BitsDic<T, U, number>;
  nega: BitsDic<T, U, number>;
  idx: BitsDic<T, U, number>;
  constructor(
    labels: readonly T[],
    options: {
      [key in U]: readonly T[];
    }
  );
  by(src: Labels<T, U>): number;
  by(src: number): Labels<T, U>;
  data(n: number): BitsData<T, U>;
  to_str(n: number | BitsData<T, U>): string;
  by_str(str: string | null | undefined): BitsData<T, U>;
  to_url(n: number | BitsData<T, U>): string;
  static toggle(x: number, y: number): number;
  static isSingle(x: number): boolean;
  static firstOff(x: number): number;
  static firstOn(x: number): number;
  static firstLinksOff(x: number): number;
  static firstLinksOn(x: number): number;
  static findBitOn(x: number): number;
  static findBitOff(x: number): number;
  static fillHeadsToOn(x: number): number;
  static fillHeadsToOff(x: number): number;
  static headsBitOff(x: number): number;
  static headsBitOn(x: number): number;
  static headsBitOffAndNextOn(x: number): number;
  static snoob(x: number): number;
  static humming(x: number, y: number): number;
  static count(x: number): number;
}
export {};
