declare type Label<T, U> = T | U | 'all';
declare type Labels<T, U> = readonly (T | U | 'all')[];
declare type BitsDic<T extends string, U extends string, X> = {
    [key in Label<T, U>]: X;
};
export declare class BitsNData<T extends string, U extends string | never> {
    value: bigint;
    field: BitsN<T, U>;
    is: BitsDic<T, U, boolean>;
    has: BitsDic<T, U, bigint>;
    constructor(value: bigint, field: BitsN<T, U>);
    posi(...labels: Labels<T, U>): BitsNData<T, U>;
    nega(...labels: Labels<T, U>): BitsNData<T, U>;
    toggle(...labels: Labels<T, U>): BitsNData<T, U>;
}
export declare class BitsN<T extends string, U extends string> {
    labels: Labels<T, U>;
    mask: bigint;
    posi: BitsDic<T, U, bigint>;
    nega: BitsDic<T, U, bigint>;
    idx: BitsDic<T, U, bigint>;
    constructor(labels: readonly T[], options: {
        [key in U]: readonly T[];
    });
    by(src: Labels<T, U>): bigint;
    by(src: bigint): Labels<T, U>;
    data(n: bigint): BitsNData<T, U>;
    to_str(n: bigint | BitsNData<T, U>): string;
    by_str(str: string | null | undefined): BitsNData<T, U>;
    to_url(n: bigint | BitsNData<T, U>): string;
    static toggle(x: bigint, y: bigint): bigint;
    static isSingle(x: bigint): boolean;
    static firstOff(x: bigint): bigint;
    static firstOn(x: bigint): bigint;
    static firstLinksOff(x: bigint): bigint;
    static firstLinksOn(x: bigint): bigint;
    static findBitOn(x: bigint): bigint;
    static findBitOff(x: bigint): bigint;
    static fillHeadsToOn(x: bigint): bigint;
    static fillHeadsToOff(x: bigint): bigint;
    static headsBitOff(x: bigint): bigint;
    static headsBitOn(x: bigint): bigint;
    static headsBitOffAndNextOn(x: bigint): bigint;
    static snoob(x: bigint): bigint;
    static humming(x: bigint, y: bigint): number;
    static count(bx: bigint): number;
}
export {};
