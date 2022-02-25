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
  del: (
    ids: (
      | 'tiny'
      | 'weak'
      | 'juna'
      | 'say1'
      | 'say5x200'
      | 'say5x300'
      | 'saving'
      | 'euro'
      | 'wbbs'
      | 'sow'
      | 'vulcan'
      | 'infinity'
      | 'lobby'
      | 'say5'
      | 'weak_braid'
      | 'juna_braid'
      | 'vulcan_braid'
      | 'infinity_braid'
    )[]
  ) => void;
  find: (
    _id:
      | 'tiny'
      | 'weak'
      | 'juna'
      | 'say1'
      | 'say5x200'
      | 'say5x300'
      | 'saving'
      | 'euro'
      | 'wbbs'
      | 'sow'
      | 'vulcan'
      | 'infinity'
      | 'lobby'
      | 'say5'
      | 'weak_braid'
      | 'juna_braid'
      | 'vulcan_braid'
      | 'infinity_braid'
  ) => SayLimit;
  index: (
    _id:
      | 'tiny'
      | 'weak'
      | 'juna'
      | 'say1'
      | 'say5x200'
      | 'say5x300'
      | 'saving'
      | 'euro'
      | 'wbbs'
      | 'sow'
      | 'vulcan'
      | 'infinity'
      | 'lobby'
      | 'say5'
      | 'weak_braid'
      | 'juna_braid'
      | 'vulcan_braid'
      | 'infinity_braid'
  ) => string | number | boolean;
  reduce: <EMIT>(
    ids: (
      | 'tiny'
      | 'weak'
      | 'juna'
      | 'say1'
      | 'say5x200'
      | 'say5x300'
      | 'saving'
      | 'euro'
      | 'wbbs'
      | 'sow'
      | 'vulcan'
      | 'infinity'
      | 'lobby'
      | 'say5'
      | 'weak_braid'
      | 'juna_braid'
      | 'vulcan_braid'
      | 'infinity_braid'
    )[],
    emit: (o: EMIT) => void
  ) => import('svelte-map-reduce-store/fast-sort').SortCmd<SayLimit & EMIT>;
  filter: <A extends any[]>(
    validator: (o: SayLimit, ...args: A) => boolean,
    key?: string
  ) => (
    ...filter_args: A
  ) => {
    reduce: <EMIT_1>(
      ids: (
        | 'tiny'
        | 'weak'
        | 'juna'
        | 'say1'
        | 'say5x200'
        | 'say5x300'
        | 'saving'
        | 'euro'
        | 'wbbs'
        | 'sow'
        | 'vulcan'
        | 'infinity'
        | 'lobby'
        | 'say5'
        | 'weak_braid'
        | 'juna_braid'
        | 'vulcan_braid'
        | 'infinity_braid'
      )[],
      emit: (o: EMIT_1) => void
    ) => import('svelte-map-reduce-store/fast-sort').SortCmd<SayLimit & EMIT_1>;
    filter: any;
    sort: (...sa: any[]) => void;
    data: {
      list: SayLimit[];
    };
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<{
        list: SayLimit[];
      }>,
      invalidate?: (value?: { list: SayLimit[] }) => void
    ) => import('svelte/store').Unsubscriber;
    validator: (o: SayLimit, ...args: A) => boolean;
  };
  sort: (...sa: any[]) => void;
  format: () => {
    list: SayLimit[];
  };
  data: {
    list: SayLimit[];
  };
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      list: SayLimit[];
    }>,
    invalidate?: (value?: { list: SayLimit[] }) => void
  ) => import('svelte/store').Unsubscriber;
};
