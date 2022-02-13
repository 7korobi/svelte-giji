import type { presentation } from '../_type/string';
import json from '$lib/game/json/set_option.json';
export declare type OPTION_ID = keyof typeof json;
export declare type Option = {
  _id: OPTION_ID;
  label: presentation;
  help: presentation;
};
export declare const Options: {
  deploy: (json: any, init?: (doc: Option) => void) => void;
  clear: () => void;
  add: (docs: Option[], init?: (doc: Option) => void) => void;
  del: (ids: ('entrust' | 'select-role' | 'random-target' | 'seq-event' | 'show-id' | 'undead-talk' | 'aiming-talk')[]) => void;
  find: (_id: 'entrust' | 'select-role' | 'random-target' | 'seq-event' | 'show-id' | 'undead-talk' | 'aiming-talk') => Option;
  index: (_id: 'entrust' | 'select-role' | 'random-target' | 'seq-event' | 'show-id' | 'undead-talk' | 'aiming-talk') => unknown;
  reduce: <EMIT>(
    ids: ('entrust' | 'select-role' | 'random-target' | 'seq-event' | 'show-id' | 'undead-talk' | 'aiming-talk')[],
    emit: (o: EMIT) => void
  ) => import('svelte-map-reduce-store/fast-sort').SortCmd<Option & EMIT>;
  filter: <A extends any[]>(
    validator: (o: Option, ...args: A) => boolean,
    key?: string
  ) => (
    ...filter_args: A
  ) => {
    reduce: <EMIT_1>(
      ids: ('entrust' | 'select-role' | 'random-target' | 'seq-event' | 'show-id' | 'undead-talk' | 'aiming-talk')[],
      emit: (o: EMIT_1) => void
    ) => import('svelte-map-reduce-store/fast-sort').SortCmd<Option & EMIT_1>;
    filter: any;
    sort: () => void;
    data: {
      list: Option[];
    };
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<{
        list: Option[];
      }>,
      invalidate?: (value?: { list: Option[] }) => void
    ) => import('svelte/store').Unsubscriber;
    validator: (o: Option, ...args: A) => boolean;
  };
  sort: () => void;
  format: () => {
    list: Option[];
  };
  data: {
    list: Option[];
  };
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      list: Option[];
    }>,
    invalidate?: (value?: { list: Option[] }) => void
  ) => import('svelte/store').Unsubscriber;
};
