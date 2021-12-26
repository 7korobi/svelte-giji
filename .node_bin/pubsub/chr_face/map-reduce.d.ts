import type { DIC } from '$lib/map-reduce';
import type { presentation } from '../_type/string';
import type { ChrJob, Tag } from '../map-reduce';
export declare type FacesFormat = {
    list: Face[];
    tag?: Tag;
    chr_jobs?: ChrJob[];
    name_head: string[][];
    name_head_dic: DIC<string[]>;
};
export declare type Face = {
    _id: string;
    tag_ids: string[];
    tags?: Tag[];
    yml_idx: number;
    order: number;
    name: presentation;
    comment: presentation;
};
export declare const Faces: {
    deploy: (json: any, init?: (doc: Face) => void) => void;
    clear: () => void;
    add: (docs: Face[], init?: (doc: Face) => void) => void;
    del: (ids: string[]) => void;
    find: (id: string) => Face;
    reduce: <EMIT>(ids: string[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Face & EMIT>;
    filter: <A extends any[]>(validator: (o: Face, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT>(ids: string[], emit: (o: EMIT) => void) => import("../../map-reduce/fast-sort").SortCmd<Face & EMIT>;
        filter: any;
        sort: () => void;
        data: {
            list: Face[];
            remain: string[];
            cover: string[];
            tag: DIC<FacesFormat>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Face[];
            remain: string[];
            cover: string[];
            tag: DIC<FacesFormat>;
        }>, invalidate?: (value?: {
            list: Face[];
            remain: string[];
            cover: string[];
            tag: DIC<FacesFormat>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Face, ...args: A) => boolean;
    };
    sort: () => void;
    format: () => {
        list: Face[];
        remain: string[];
        cover: string[];
        tag: DIC<FacesFormat>;
    };
    data: {
        list: Face[];
        remain: string[];
        cover: string[];
        tag: DIC<FacesFormat>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Face[];
        remain: string[];
        cover: string[];
        tag: DIC<FacesFormat>;
    }>, invalidate?: (value?: {
        list: Face[];
        remain: string[];
        cover: string[];
        tag: DIC<FacesFormat>;
    }) => void) => import("svelte/store").Unsubscriber;
};
