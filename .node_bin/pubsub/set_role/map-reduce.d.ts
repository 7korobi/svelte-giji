import type { DIC } from 'svelte-map-reduce-store';
import type { ABLE_ID, WIN } from '../map-reduce';
import type { presentation } from '../_type/string';
import set_role_gifts from '$lib/game/json/set_role_gifts.json';
import set_role_lives from '$lib/game/json/set_role_lives.json';
import set_role_mobs from '$lib/game/json/set_role_mobs.json';
import set_role_specials from '$lib/game/json/set_role_specials.json';
import set_role_traps from '$lib/game/json/set_role_traps.json';
import set_role_turns from '$lib/game/json/set_role_turns.json';
import set_roles from '$lib/game/json/set_roles.json';
export declare type GIFT_ID = keyof typeof set_role_gifts;
export declare type LIVE_ID = keyof typeof set_role_lives;
export declare type MOB_ID = keyof typeof set_role_mobs;
export declare type SPECIAL_ID = keyof typeof set_role_specials;
export declare type TRAP_ID = keyof typeof set_role_traps;
export declare type TURN_ID = keyof typeof set_role_turns;
export declare type ROLE_ID = SPECIAL_ID | TURN_ID | MOB_ID | TRAP_ID | LIVE_ID | GIFT_ID | keyof typeof set_roles;
export declare type Role = GiftRole | LiveRole | MobRole | SpecialRole | TrapRole | TurnRole | TitleRole;
declare type TrapRole = {
    _id: TRAP_ID;
    group: 'TRAP';
    win: null;
    able_ids: ABLE_ID[];
    label: presentation;
    help: presentation;
};
declare type TurnRole = {
    _id: TURN_ID;
    group: 'TURN';
    win: null;
    able_ids: ABLE_ID[];
    label: presentation;
    help: presentation;
};
declare type LiveRole = {
    _id: LIVE_ID;
    group: 'LIVE' | null;
    win: null;
    able_ids: ABLE_ID[];
    label: presentation;
    help: presentation;
};
export declare type MobRole = {
    _id: MOB_ID;
    group: 'MOB';
    win: 'MOB' | 'HUMAN';
    able_ids: ABLE_ID[];
    label: presentation;
    help: presentation;
};
declare type SpecialRole = {
    _id: SPECIAL_ID;
    group: 'SPECIAL';
    win: null;
    able_ids: ABLE_ID[];
    label: presentation;
    help: presentation;
};
declare type GiftRole = {
    _id: GIFT_ID;
    group: 'GIFT';
    win: WIN | null;
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd?: 'role';
    label: presentation;
    help: presentation;
};
declare type TitleRole = HumanRole | EvilRole | WolfRole | PixiRole | OtherRole | BindRole | disabledRole;
declare type HumanRole = {
    _id: ROLE_ID;
    group: 'HUMAN';
    win: 'HUMAN';
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd: 'role';
    label: presentation;
    help: presentation;
};
declare type EvilRole = {
    _id: ROLE_ID;
    group: 'EVIL';
    win: 'EVIL';
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd: 'role';
    label: presentation;
    help: presentation;
};
declare type WolfRole = {
    _id: ROLE_ID;
    group: 'WOLF';
    win: 'WOLF' | 'LONEWOLF';
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd: 'role';
    label: presentation;
    help: presentation;
};
declare type PixiRole = {
    _id: ROLE_ID;
    group: 'PIXI';
    win: 'PIXI';
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd: 'role';
    label: presentation;
    help: presentation;
};
declare type OtherRole = {
    _id: ROLE_ID;
    group: 'OTHER';
    win: 'HATER' | 'LOVER' | 'GURU' | 'DISH';
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd: 'role';
    label: presentation;
    help: presentation;
};
declare type BindRole = {
    _id: ROLE_ID;
    group: 'BIND';
    win: 'HATER' | 'LOVER';
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd: 'role';
    label: presentation;
    help: presentation;
};
declare type disabledRole = {
    _id: ROLE_ID;
    group: undefined;
    win: WIN;
    able_ids: ABLE_ID[];
    able?: presentation;
    cmd?: 'role';
    label: presentation;
    help: presentation;
};
export declare const Roles: {
    deploy: (json: any, init?: (doc: Role) => void) => void;
    clear: () => void;
    add: (docs: Role[], init?: (doc: Role) => void) => void;
    del: (ids: ROLE_ID[]) => void;
    find: (_id: ROLE_ID) => Role;
    index: (_id: ROLE_ID) => string | number | boolean;
    reduce: <EMIT>(ids: ROLE_ID[], emit: (o: EMIT) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Role & EMIT>;
    filter: <A extends any[]>(validator: (o: Role, ...args: A) => boolean, key?: string) => (...filter_args: A) => {
        reduce: <EMIT_1>(ids: ROLE_ID[], emit: (o: EMIT_1) => void) => import("svelte-map-reduce-store/fast-sort").SortCmd<Role & EMIT_1>;
        filter: any;
        sort: (...sa: any[]) => void;
        data: {
            list: Role[];
            group: DIC<{
                list: Role[];
            }>;
        };
        subscribe: (this: void, run: import("svelte/store").Subscriber<{
            list: Role[];
            group: DIC<{
                list: Role[];
            }>;
        }>, invalidate?: (value?: {
            list: Role[];
            group: DIC<{
                list: Role[];
            }>;
        }) => void) => import("svelte/store").Unsubscriber;
        validator: (o: Role, ...args: A) => boolean;
    };
    sort: (...sa: any[]) => void;
    format: () => {
        list: Role[];
        group: DIC<{
            list: Role[];
        }>;
    };
    data: {
        list: Role[];
        group: DIC<{
            list: Role[];
        }>;
    };
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        list: Role[];
        group: DIC<{
            list: Role[];
        }>;
    }>, invalidate?: (value?: {
        list: Role[];
        group: DIC<{
            list: Role[];
        }>;
    }) => void) => import("svelte/store").Unsubscriber;
};
export {};
