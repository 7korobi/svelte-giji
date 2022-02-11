import type { presentation } from '../_type/string';
import type { ROLE_ID } from '../map-reduce';
import json from '$lib/game/json/sow_roletables.json';
export declare type ROLE_TABLE_ID = keyof typeof json;
export declare type RoleTable = {
  _id: ROLE_TABLE_ID;
  label: presentation;
  role_ids_list: ROLE_ID[][];
};
export declare const RoleTables: {
  deploy: (json: any, init?: (doc: RoleTable) => void) => void;
  clear: () => void;
  add: (docs: RoleTable[], init?: (doc: RoleTable) => void) => void;
  del: (
    ids: (
      | 'ultimate'
      | 'lover'
      | 'hamster'
      | 'custom'
      | 'default'
      | 'mistery'
      | 'random'
      | 'test1st'
      | 'test2nd'
      | 'wbbs_c'
      | 'wbbs_f'
      | 'wbbs_g'
      | 'secret'
    )[]
  ) => void;
  find: (
    id:
      | 'ultimate'
      | 'lover'
      | 'hamster'
      | 'custom'
      | 'default'
      | 'mistery'
      | 'random'
      | 'test1st'
      | 'test2nd'
      | 'wbbs_c'
      | 'wbbs_f'
      | 'wbbs_g'
      | 'secret'
  ) => RoleTable;
  reduce: <EMIT>(
    ids: (
      | 'ultimate'
      | 'lover'
      | 'hamster'
      | 'custom'
      | 'default'
      | 'mistery'
      | 'random'
      | 'test1st'
      | 'test2nd'
      | 'wbbs_c'
      | 'wbbs_f'
      | 'wbbs_g'
      | 'secret'
    )[],
    emit: (o: EMIT) => void
  ) => import('svelte-map-reduce-store/fast-sort').SortCmd<RoleTable & EMIT>;
  filter: <A extends any[]>(
    validator: (o: RoleTable, ...args: A) => boolean,
    key?: string
  ) => (
    ...filter_args: A
  ) => {
    reduce: <EMIT_1>(
      ids: (
        | 'ultimate'
        | 'lover'
        | 'hamster'
        | 'custom'
        | 'default'
        | 'mistery'
        | 'random'
        | 'test1st'
        | 'test2nd'
        | 'wbbs_c'
        | 'wbbs_f'
        | 'wbbs_g'
        | 'secret'
      )[],
      emit: (o: EMIT_1) => void
    ) => import('svelte-map-reduce-store/fast-sort').SortCmd<RoleTable & EMIT_1>;
    filter: any;
    sort: () => void;
    data: {
      list: RoleTable[];
    };
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<{
        list: RoleTable[];
      }>,
      invalidate?: (value?: { list: RoleTable[] }) => void
    ) => import('svelte/store').Unsubscriber;
    validator: (o: RoleTable, ...args: A) => boolean;
  };
  sort: () => void;
  format: () => {
    list: RoleTable[];
  };
  data: {
    list: RoleTable[];
  };
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      list: RoleTable[];
    }>,
    invalidate?: (value?: { list: RoleTable[] }) => void
  ) => import('svelte/store').Unsubscriber;
};
