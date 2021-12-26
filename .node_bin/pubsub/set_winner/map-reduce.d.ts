import json from '$lib/game/json/set_winner.json';
import type { presentation } from '../_type/string';
export declare type WINNER_ID = keyof typeof json;
export declare type Winner = {
    _id: WINNER_ID;
    label: presentation;
    help: presentation;
};
export declare const Winners: {
    deploy: (json: any, init?: (doc: Winner) => void) => void;
    clear: () => void;
    add: (docs: Winner[], init?: (doc: Winner) => void) => void;
    del: (ids: ("WOLF" | "MOB" | "HUMAN" | "PIXI" | "EVIL" | "HATER" | "OTHER" | "LOVER" | "LONEWOLF" | "GURU" | "DISH" | "NONE" | "LEAVE")[]) => void;
    find: (id: "WOLF" | "MOB" | "HUMAN" | "PIXI" | "EVIL" | "HATER" | "OTHER" | "LOVER" | "LONEWOLF" | "GURU" | "DISH" | "NONE" | "LEAVE") => Winner;
    reduce: <EMIT>(ids: ("WOLF" | "MOB" | "HUMAN" | "PIXI" | "EVIL" | "HATER" | "OTHER" | "LOVER" | "LONEWOLF" | "GURU" | "DISH" | "NONE" | "LEAVE")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Winner & EMIT>;
    filter: <A extends any[]>(validator: (o: Winner, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: ("WOLF" | "MOB" | "HUMAN" | "PIXI" | "EVIL" | "HATER" | "OTHER" | "LOVER" | "LONEWOLF" | "GURU" | "DISH" | "NONE" | "LEAVE")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Winner & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: Winner[];
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Winner[];
        }>, invalidate?: (value?: {
            list: Winner[];
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Winner, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: Winner[];
    };
    data: {
        list: Winner[];
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Winner[];
    }>, invalidate?: (value?: {
        list: Winner[];
    }) => void) => import("svelte/store").Unsubscriber;
};
