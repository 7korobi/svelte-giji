import json from '$lib/game/json/set_says.json';
import type { presentation } from '../_type/string';
export declare type SAY_LIMIT_ID = keyof typeof json;
export declare type PhaseLimits = {
    SSAY: number;
    GSAY: number;
    TSAY: number;
    VSSAY: number;
    VGSAY: number;
    PSAY: number;
    WSAY: number;
    XSAY: number;
};
export declare type SayLimit = {
    _id: SAY_LIMIT_ID;
    label: presentation;
    help: presentation;
    recovery?: '24h';
    unit: '回' | 'pt';
    count?: PhaseLimits;
    all?: PhaseLimits;
    max: {
        size: number;
        word: number;
        line: number;
    };
};
export declare const SayLimits: {
    deploy: (json: any, init?: (doc: SayLimit) => void) => void;
    clear: () => void;
    add: (docs: SayLimit[], init?: (doc: SayLimit) => void) => void;
    del: (ids: ("lobby" | "say5" | "wbbs" | "euro" | "weak" | "juna" | "infinity" | "sow" | "say1" | "say5x200" | "say5x300" | "saving" | "tiny" | "vulcan" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid")[]) => void;
    find: (id: "lobby" | "say5" | "wbbs" | "euro" | "weak" | "juna" | "infinity" | "sow" | "say1" | "say5x200" | "say5x300" | "saving" | "tiny" | "vulcan" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid") => SayLimit;
    reduce: <EMIT>(ids: ("lobby" | "say5" | "wbbs" | "euro" | "weak" | "juna" | "infinity" | "sow" | "say1" | "say5x200" | "say5x300" | "saving" | "tiny" | "vulcan" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<SayLimit & EMIT>;
    filter: <A extends any[]>(validator: (o: SayLimit, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: ("lobby" | "say5" | "wbbs" | "euro" | "weak" | "juna" | "infinity" | "sow" | "say1" | "say5x200" | "say5x300" | "saving" | "tiny" | "vulcan" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<SayLimit & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: SayLimit[];
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: SayLimit[];
        }>, invalidate?: (value?: {
            list: SayLimit[];
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: SayLimit, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: SayLimit[];
    };
    data: {
        list: SayLimit[];
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: SayLimit[];
    }>, invalidate?: (value?: {
        list: SayLimit[];
    }) => void) => import("svelte/store").Unsubscriber;
};
