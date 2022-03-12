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
    find: (_id: "regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien") => Locale;
    index: (_id: "regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien") => string | number | boolean;
    reduce: <EMIT>(ids: ("regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien")[], emit: (o: EMIT) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Locale & EMIT>;
    filter: <A extends any[]>(validator: (o: Locale, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT_1>(ids: ("regend" | "heavy" | "secret" | "village" | "complex" | "orbit" | "alien")[], emit: (o: EMIT_1) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Locale & EMIT_1>;
        filter: any;
        sort: (...sa: any[]) => void;
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
    sort: (...sa: any[]) => void;
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
