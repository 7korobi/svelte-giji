import type { presentation } from '../_type/string';
import json from '$lib/game/json/set_mark.json';
export declare type MARK_ID = keyof typeof json;
export declare type Mark = {
    _id: MARK_ID;
    label: presentation;
    file: string;
};
export declare const Marks: {
    deploy: (json: any, init?: (doc: Mark) => void) => void;
    clear: () => void;
    add: (docs: Mark[], init?: (doc: Mark) => void) => void;
    del: (ids: ("love" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "cat" | "music" | "appare")[]) => void;
    find: (id: "love" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "cat" | "music" | "appare") => Mark;
    reduce: <EMIT>(ids: ("love" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "cat" | "music" | "appare")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Mark & EMIT>;
    filter: <A extends any[]>(validator: (o: Mark, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: ("love" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "cat" | "music" | "appare")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Mark & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: Mark[];
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Mark[];
        }>, invalidate?: (value?: {
            list: Mark[];
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Mark, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: Mark[];
    };
    data: {
        list: Mark[];
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Mark[];
    }>, invalidate?: (value?: {
        list: Mark[];
    }) => void) => import("svelte/store").Unsubscriber;
};
