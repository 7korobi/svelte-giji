import type { ARY, DIC } from '$lib/map-reduce';
import type { presentation } from '../_type/string';
import type { FaceID } from '../_type/id';
import type { Face } from '../map-reduce';
export declare type CHR_SET_IDX = typeof CHR_SET_IDS[number];
export declare type CSID = typeof CSIDS[number];
export declare type CHR_JOB_ID = `${CHR_SET_IDX}_${FaceID}`;
export declare type ChrSet = {
    _id: CHR_SET_IDX;
    npcs: ChrNpc[];
    admin: presentation;
    maker: presentation;
    label: presentation;
};
export declare type ChrNpc = {
    _id: CHR_JOB_ID;
    csid: CSID;
    face_id: FaceID;
    face?: Face;
    chr_set_id: CHR_SET_IDX;
    chr_set?: ChrSet;
    chr_set_at: number;
    chr_job?: ChrJob;
    label: presentation;
    intro: presentation[];
    say_0: presentation;
    say_1: presentation;
    say_2?: presentation;
};
export declare type ChrJob = {
    _id: CHR_JOB_ID;
    face_id: FaceID;
    face?: Face;
    chr_set_id: CHR_SET_IDX;
    chr_set?: ChrSet;
    chr_set_at: number;
    job: presentation;
    head?: string;
    search_words?: string;
};
export declare const CHR_SET_IDS: readonly ["ririnra", "wa", "time", "sf", "fable", "mad", "ger", "changed", "animal", "school", "all"];
export declare const CSIDS: readonly ["ririnra", "ririnra_c01", "ririnra_c05", "ririnra_c08", "ririnra_c19", "ririnra_c67", "ririnra_c68", "ririnra_c72", "ririnra_c51", "ririnra_c20", "ririnra_c32", "all", "mad", "mad_mad05", "time", "ger", "animal", "school", "changed", "changed_m05", "SF", "SF_sf10", "wa", "wa_w23"];
export declare const ChrSets: {
    deploy: (json: any, init?: (doc: ChrSet) => void) => void;
    clear: () => void;
    add: (docs: ChrSet[], init?: (doc: ChrSet) => void) => void;
    del: (ids: ("ririnra" | "all" | "mad" | "time" | "ger" | "fable" | "animal" | "school" | "changed" | "wa" | "sf")[]) => void;
    find: (id: "ririnra" | "all" | "mad" | "time" | "ger" | "fable" | "animal" | "school" | "changed" | "wa" | "sf") => ChrSet;
    reduce: <EMIT>(ids: ("ririnra" | "all" | "mad" | "time" | "ger" | "fable" | "animal" | "school" | "changed" | "wa" | "sf")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<ChrSet & EMIT>;
    filter: <A extends any[]>(validator: (o: ChrSet, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: ("ririnra" | "all" | "mad" | "time" | "ger" | "fable" | "animal" | "school" | "changed" | "wa" | "sf")[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<ChrSet & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: ChrSet[];
            by_label: ARY<ARY<ChrSet>>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: ChrSet[];
            by_label: ARY<ARY<ChrSet>>;
        }>, invalidate?: (value?: {
            list: ChrSet[];
            by_label: ARY<ARY<ChrSet>>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: ChrSet, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: ChrSet[];
        by_label: ARY<ARY<ChrSet>>;
    };
    data: {
        list: ChrSet[];
        by_label: ARY<ARY<ChrSet>>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: ChrSet[];
        by_label: ARY<ARY<ChrSet>>;
    }>, invalidate?: (value?: {
        list: ChrSet[];
        by_label: ARY<ARY<ChrSet>>;
    }) => void) => import("svelte/store").Unsubscriber;
};
export declare const ChrNpcs: {
    deploy: (json: any, init?: (doc: ChrNpc) => void) => void;
    clear: () => void;
    add: (docs: ChrNpc[], init?: (doc: ChrNpc) => void) => void;
    del: (ids: (`ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`)[]) => void;
    find: (id: `ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`) => ChrNpc;
    reduce: <EMIT>(ids: (`ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`)[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<ChrNpc & EMIT>;
    filter: <A extends any[]>(validator: (o: ChrNpc, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: (`ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`)[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<ChrNpc & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: ChrNpc[];
            chr_set: DIC<{
                list: ChrNpc[];
            }>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: ChrNpc[];
            chr_set: DIC<{
                list: ChrNpc[];
            }>;
        }>, invalidate?: (value?: {
            list: ChrNpc[];
            chr_set: DIC<{
                list: ChrNpc[];
            }>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: ChrNpc, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: ChrNpc[];
        chr_set: DIC<{
            list: ChrNpc[];
        }>;
    };
    data: {
        list: ChrNpc[];
        chr_set: DIC<{
            list: ChrNpc[];
        }>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: ChrNpc[];
        chr_set: DIC<{
            list: ChrNpc[];
        }>;
    }>, invalidate?: (value?: {
        list: ChrNpc[];
        chr_set: DIC<{
            list: ChrNpc[];
        }>;
    }) => void) => import("svelte/store").Unsubscriber;
};
export declare const ChrJobs: {
    deploy: (json: any, init?: (doc: ChrJob) => void) => void;
    clear: () => void;
    add: (docs: ChrJob[], init?: (doc: ChrJob) => void) => void;
    del: (ids: (`ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`)[]) => void;
    find: (id: `ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`) => ChrJob;
    reduce: <EMIT>(ids: (`ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`)[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<ChrJob & EMIT>;
    filter: <A extends any[]>(validator: (o: ChrJob, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: (`ririnra_${string}` | `all_${string}` | `mad_${string}` | `time_${string}` | `ger_${string}` | `fable_${string}` | `animal_${string}` | `school_${string}` | `changed_${string}` | `wa_${string}` | `sf_${string}`)[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<ChrJob & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: ChrJob[];
            face: DIC<ChrJob[]>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: ChrJob[];
            face: DIC<ChrJob[]>;
        }>, invalidate?: (value?: {
            list: ChrJob[];
            face: DIC<ChrJob[]>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: ChrJob, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: ChrJob[];
        face: DIC<ChrJob[]>;
    };
    data: {
        list: ChrJob[];
        face: DIC<ChrJob[]>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: ChrJob[];
        face: DIC<ChrJob[]>;
    }>, invalidate?: (value?: {
        list: ChrJob[];
        face: DIC<ChrJob[]>;
    }) => void) => import("svelte/store").Unsubscriber;
};
