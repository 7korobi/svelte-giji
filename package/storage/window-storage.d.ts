import type { Writable } from 'svelte/store';
declare type Convert<T> = {
    parse(str: string): T;
    stringify(val: T): string;
};
export declare function writeLocal<T>(key: string, initValue: T, convert?: Convert<T>): Writable<T>;
export declare function writeSession<T>(key: string, initValue: T, convert?: Convert<T>): Writable<T>;
export {};
