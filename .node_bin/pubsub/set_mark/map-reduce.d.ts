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
    del: (ids: ("love" | "cat" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "music" | "appare")[]) => void;
    find: (_id: "love" | "cat" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "music" | "appare") => Mark;
    index: (_id: "love" | "cat" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "music" | "appare") => string | number | boolean;
    reduce: <EMIT>(ids: ("love" | "cat" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "music" | "appare")[], emit: (o: EMIT) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Mark & EMIT>;
    filter: <A extends any[]>(validator: (o: Mark, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT_1>(ids: ("love" | "cat" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "music" | "appare")[], emit: (o: EMIT_1) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Mark & EMIT_1>;
        filter: any;
        sort: (...sa: any[]) => void;
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
    sort: (...sa: any[]) => void;
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
