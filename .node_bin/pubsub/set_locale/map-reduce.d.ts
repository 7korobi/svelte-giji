import type { presentation } from '../_type/string';
import json from '$lib/game/json/set_locale.json';
export declare type LOCALE_ID = keyof typeof json;
export declare type Locale = {
    _id: LOCALE_ID;
    label: presentation;
    path: string;
};
export declare const Locales: {
    deploy: (json: any, init?: (doc: Locale) => void) => void;
    clear: () => void;
    add: (docs: Locale[], init?: (doc: Locale) => void) => void;
    del: (ids: ("regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien")[]) => void;
    find: (id: "regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien") => Locale;
    reduce: <EMIT>(ids: ("regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Locale & EMIT>;
    filter: <A extends any[]>(validator: (o: Locale, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: ("regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Locale & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: Locale[];
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Locale[];
        }>, invalidate?: (value?: {
            list: Locale[];
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Locale, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: Locale[];
    };
    data: {
        list: Locale[];
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Locale[];
    }>, invalidate?: (value?: {
        list: Locale[];
    }) => void) => import("svelte/store").Unsubscriber;
};
