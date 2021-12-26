import type { DIC } from '$lib/map-reduce';
import type { presentation } from '../_type/string';
import json from '$lib/game/json/random.json';
export declare type RANDOM_TYPE = 'eto' | 'trump' | keyof typeof json;
export declare type ShuffleFormat = {
    list: Random[];
    count: number;
    all: number;
};
export declare type Random = {
    _id: string | number;
    types: RANDOM_TYPE[];
    order: number;
    ratio: number;
    label: presentation;
    name?: presentation;
    hebrew?: presentation;
    symbol?: presentation;
    choice?: presentation;
    year?: number;
    number?: number;
    rank?: typeof RANKS[number];
    suite?: typeof SUITES[number];
    roman?: typeof ROMANS[number];
};
export declare type SUITES = typeof SUITES[number];
export declare type RANKS = typeof RANKS[number];
export declare type ROMANS = typeof ROMANS[number];
export declare const RANDOM_TYPES: readonly ["eto", "eto10", "eto12", "trump", "tarot", "zodiac", "planet", "chess", "coin", "weather"];
export declare const SUITES: readonly ["", "♢", "♡", "♣", "♠"];
export declare const RANKS: readonly ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export declare const ROMANS: readonly ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
export declare const Randoms: {
    deploy: (json: any, init?: (doc: Random) => void) => void;
    clear: () => void;
    add: (docs: Random[], init?: (doc: Random) => void) => void;
    del: (ids: (string | number)[]) => void;
    find: (id: string | number) => Random;
    reduce: <EMIT>(ids: (string | number)[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Random & EMIT>;
    filter: <A extends any[]>(validator: (o: Random, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: (string | number)[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Random & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: Random[];
            count: number;
            all: number;
            type: DIC<ShuffleFormat>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Random[];
            count: number;
            all: number;
            type: DIC<ShuffleFormat>;
        }>, invalidate?: (value?: {
            list: Random[];
            count: number;
            all: number;
            type: DIC<ShuffleFormat>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Random, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: Random[];
        count: number;
        all: number;
        type: DIC<ShuffleFormat>;
    };
    data: {
        list: Random[];
        count: number;
        all: number;
        type: DIC<ShuffleFormat>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Random[];
        count: number;
        all: number;
        type: DIC<ShuffleFormat>;
    }>, invalidate?: (value?: {
        list: Random[];
        count: number;
        all: number;
        type: DIC<ShuffleFormat>;
    }) => void) => import("svelte/store").Unsubscriber;
};
