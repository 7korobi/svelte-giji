import type { DIC } from 'svelte-map-reduce-store';
import type { presentation } from '../_type/string';
import json from '$lib/game/json/set_ables.json';
export declare type ABLE_ID = keyof typeof json;
export declare type CMD_ID = typeof CMD_IDS[number];
export declare type HIDE_ID = typeof HIDE_IDS[number];
export declare const ABLE_IDS: ("update" | "ADMIN" | "MAKER" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "maker" | "kick" | "muster" | "editvilform" | "scrapvil" | "ENTRY" | "exit" | "VGSAY" | "vote" | "entrust" | "incite" | "gm_droop" | "gm_live" | "gm_disable_vote" | "gm_enable_vote" | "grave" | "SSAY" | "commit" | "droop" | "circular" | "guard" | "see" | "wolf" | "hunt" | "friend" | "pixi" | "evil" | "once" | "spy_wolf" | "aura" | "bond" | "rob" | "human" | "spy_aura" | "hike" | "revenge" | "tangle" | "stigma" | "fm" | "PSAY" | "spy_win" | "spy_role" | "medium" | "chkGSAY" | "riot" | "sneak" | "tafness" | "august" | "blind" | "cure" | "curse" | "seal" | "cling" | "analeptic" | "poison" | "night" | "scapegoat" | "twolife" | "jammer" | "XSAY" | "snatch" | "fanatic" | "MSAY" | "wolfify" | "grudge" | "armor" | "bonds" | "hate" | "love" | "kill" | "guru" | "dish" | "bitch" | "hurt" | "sheep" | "infected" | "hide_for_vote" | "hide_for_role" | "hide_for_gift" | "disable_vote" | "disable_special" | "disable_gift" | "disable_role" | "disable_poison" | "disable_analeptic")[];
export declare const CMD_IDS: readonly ["editvilform", "muster", "update", "scrapvil", "exit", "commit", "vote", "gamemaster", "maker", "kick", "entry", "write"];
export declare const HIDE_IDS: string[];
export declare type Able = {
    _id: ABLE_ID;
    group?: 'GM' | 'POTOF' | 'STATUS';
    at?: 'start' | 'prologue' | 'progress' | 'around' | 'all';
    for?: 'cast' | 'live' | 'dead' | 'gm_live' | 'gm_dead';
    hide?: HIDE_ID[];
    disable?: HIDE_ID[];
    cmd?: CMD_ID;
    text?: ('talk' | 'memo' | 'act')[];
    sw?: presentation;
    pass?: presentation;
    target?: presentation;
    btn?: presentation;
    change?: presentation;
    help: presentation;
};
export declare const Ables: {
    deploy: (json: any, init?: (doc: Able) => void) => void;
    clear: () => void;
    add: (docs: Able[], init?: (doc: Able) => void) => void;
    del: (ids: ("update" | "ADMIN" | "MAKER" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "maker" | "kick" | "muster" | "editvilform" | "scrapvil" | "ENTRY" | "exit" | "VGSAY" | "vote" | "entrust" | "incite" | "gm_droop" | "gm_live" | "gm_disable_vote" | "gm_enable_vote" | "grave" | "SSAY" | "commit" | "droop" | "circular" | "guard" | "see" | "wolf" | "hunt" | "friend" | "pixi" | "evil" | "once" | "spy_wolf" | "aura" | "bond" | "rob" | "human" | "spy_aura" | "hike" | "revenge" | "tangle" | "stigma" | "fm" | "PSAY" | "spy_win" | "spy_role" | "medium" | "chkGSAY" | "riot" | "sneak" | "tafness" | "august" | "blind" | "cure" | "curse" | "seal" | "cling" | "analeptic" | "poison" | "night" | "scapegoat" | "twolife" | "jammer" | "XSAY" | "snatch" | "fanatic" | "MSAY" | "wolfify" | "grudge" | "armor" | "bonds" | "hate" | "love" | "kill" | "guru" | "dish" | "bitch" | "hurt" | "sheep" | "infected" | "hide_for_vote" | "hide_for_role" | "hide_for_gift" | "disable_vote" | "disable_special" | "disable_gift" | "disable_role" | "disable_poison" | "disable_analeptic")[]) => void;
    find: (_id: "update" | "ADMIN" | "MAKER" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "maker" | "kick" | "muster" | "editvilform" | "scrapvil" | "ENTRY" | "exit" | "VGSAY" | "vote" | "entrust" | "incite" | "gm_droop" | "gm_live" | "gm_disable_vote" | "gm_enable_vote" | "grave" | "SSAY" | "commit" | "droop" | "circular" | "guard" | "see" | "wolf" | "hunt" | "friend" | "pixi" | "evil" | "once" | "spy_wolf" | "aura" | "bond" | "rob" | "human" | "spy_aura" | "hike" | "revenge" | "tangle" | "stigma" | "fm" | "PSAY" | "spy_win" | "spy_role" | "medium" | "chkGSAY" | "riot" | "sneak" | "tafness" | "august" | "blind" | "cure" | "curse" | "seal" | "cling" | "analeptic" | "poison" | "night" | "scapegoat" | "twolife" | "jammer" | "XSAY" | "snatch" | "fanatic" | "MSAY" | "wolfify" | "grudge" | "armor" | "bonds" | "hate" | "love" | "kill" | "guru" | "dish" | "bitch" | "hurt" | "sheep" | "infected" | "hide_for_vote" | "hide_for_role" | "hide_for_gift" | "disable_vote" | "disable_special" | "disable_gift" | "disable_role" | "disable_poison" | "disable_analeptic") => Able;
    index: (_id: "update" | "ADMIN" | "MAKER" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "maker" | "kick" | "muster" | "editvilform" | "scrapvil" | "ENTRY" | "exit" | "VGSAY" | "vote" | "entrust" | "incite" | "gm_droop" | "gm_live" | "gm_disable_vote" | "gm_enable_vote" | "grave" | "SSAY" | "commit" | "droop" | "circular" | "guard" | "see" | "wolf" | "hunt" | "friend" | "pixi" | "evil" | "once" | "spy_wolf" | "aura" | "bond" | "rob" | "human" | "spy_aura" | "hike" | "revenge" | "tangle" | "stigma" | "fm" | "PSAY" | "spy_win" | "spy_role" | "medium" | "chkGSAY" | "riot" | "sneak" | "tafness" | "august" | "blind" | "cure" | "curse" | "seal" | "cling" | "analeptic" | "poison" | "night" | "scapegoat" | "twolife" | "jammer" | "XSAY" | "snatch" | "fanatic" | "MSAY" | "wolfify" | "grudge" | "armor" | "bonds" | "hate" | "love" | "kill" | "guru" | "dish" | "bitch" | "hurt" | "sheep" | "infected" | "hide_for_vote" | "hide_for_role" | "hide_for_gift" | "disable_vote" | "disable_special" | "disable_gift" | "disable_role" | "disable_poison" | "disable_analeptic") => string | number | boolean;
    reduce: <EMIT>(ids: ("update" | "ADMIN" | "MAKER" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "maker" | "kick" | "muster" | "editvilform" | "scrapvil" | "ENTRY" | "exit" | "VGSAY" | "vote" | "entrust" | "incite" | "gm_droop" | "gm_live" | "gm_disable_vote" | "gm_enable_vote" | "grave" | "SSAY" | "commit" | "droop" | "circular" | "guard" | "see" | "wolf" | "hunt" | "friend" | "pixi" | "evil" | "once" | "spy_wolf" | "aura" | "bond" | "rob" | "human" | "spy_aura" | "hike" | "revenge" | "tangle" | "stigma" | "fm" | "PSAY" | "spy_win" | "spy_role" | "medium" | "chkGSAY" | "riot" | "sneak" | "tafness" | "august" | "blind" | "cure" | "curse" | "seal" | "cling" | "analeptic" | "poison" | "night" | "scapegoat" | "twolife" | "jammer" | "XSAY" | "snatch" | "fanatic" | "MSAY" | "wolfify" | "grudge" | "armor" | "bonds" | "hate" | "love" | "kill" | "guru" | "dish" | "bitch" | "hurt" | "sheep" | "infected" | "hide_for_vote" | "hide_for_role" | "hide_for_gift" | "disable_vote" | "disable_special" | "disable_gift" | "disable_role" | "disable_poison" | "disable_analeptic")[], emit: (o: EMIT) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Able & EMIT>;
    filter: <A extends any[]>(validator: (o: Able, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT_1>(ids: ("update" | "ADMIN" | "MAKER" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "maker" | "kick" | "muster" | "editvilform" | "scrapvil" | "ENTRY" | "exit" | "VGSAY" | "vote" | "entrust" | "incite" | "gm_droop" | "gm_live" | "gm_disable_vote" | "gm_enable_vote" | "grave" | "SSAY" | "commit" | "droop" | "circular" | "guard" | "see" | "wolf" | "hunt" | "friend" | "pixi" | "evil" | "once" | "spy_wolf" | "aura" | "bond" | "rob" | "human" | "spy_aura" | "hike" | "revenge" | "tangle" | "stigma" | "fm" | "PSAY" | "spy_win" | "spy_role" | "medium" | "chkGSAY" | "riot" | "sneak" | "tafness" | "august" | "blind" | "cure" | "curse" | "seal" | "cling" | "analeptic" | "poison" | "night" | "scapegoat" | "twolife" | "jammer" | "XSAY" | "snatch" | "fanatic" | "MSAY" | "wolfify" | "grudge" | "armor" | "bonds" | "hate" | "love" | "kill" | "guru" | "dish" | "bitch" | "hurt" | "sheep" | "infected" | "hide_for_vote" | "hide_for_role" | "hide_for_gift" | "disable_vote" | "disable_special" | "disable_gift" | "disable_role" | "disable_poison" | "disable_analeptic")[], emit: (o: EMIT_1) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Able & EMIT_1>;
        filter: any;
        sort: (...sa: any[]) => void;
        data: {
            list: Able[];
            hide: Set<unknown>;
            group: DIC<{
                list: Able[];
            }>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Able[];
            hide: Set<unknown>;
            group: DIC<{
                list: Able[];
            }>;
        }>, invalidate?: (value?: {
            list: Able[];
            hide: Set<unknown>;
            group: DIC<{
                list: Able[];
            }>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Able, ...args: A) => boolean;
    };
    sort: (...sa: any[]) => void;
    format: () => {
        list: Able[];
        hide: Set<unknown>;
        group: DIC<{
            list: Able[];
        }>;
    };
    data: {
        list: Able[];
        hide: Set<unknown>;
        group: DIC<{
            list: Able[];
        }>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Able[];
        hide: Set<unknown>;
        group: DIC<{
            list: Able[];
        }>;
    }>, invalidate?: (value?: {
        list: Able[];
        hide: Set<unknown>;
        group: DIC<{
            list: Able[];
        }>;
    }) => void) => import("svelte/store").Unsubscriber;
};
