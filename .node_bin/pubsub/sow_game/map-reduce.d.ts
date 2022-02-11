import json from '$lib/game/json/sow_game.json';
import type { presentation } from '../_type/string';
export declare type GAME_ID = keyof typeof json;
export declare type Game = {
  _id: GAME_ID;
  label: presentation;
  path: string;
};
export declare const Games: {
  deploy: (json: any, init?: (doc: Game) => void) => void;
  clear: () => void;
  add: (docs: Game[], init?: (doc: Game) => void) => void;
  del: (
    ids: ('TABULA' | 'MILLERHOLLOW' | 'LIVE_TABULA' | 'LIVE_MILLERHOLLOW' | 'TROUBLE' | 'MISTERY' | 'VOV' | 'SECRET' | 'GAMEMASTER')[]
  ) => void;
  find: (
    id: 'TABULA' | 'MILLERHOLLOW' | 'LIVE_TABULA' | 'LIVE_MILLERHOLLOW' | 'TROUBLE' | 'MISTERY' | 'VOV' | 'SECRET' | 'GAMEMASTER'
  ) => Game;
  reduce: <EMIT>(
    ids: ('TABULA' | 'MILLERHOLLOW' | 'LIVE_TABULA' | 'LIVE_MILLERHOLLOW' | 'TROUBLE' | 'MISTERY' | 'VOV' | 'SECRET' | 'GAMEMASTER')[],
    emit: (o: EMIT) => void
  ) => import('svelte-map-reduce-store/fast-sort').SortCmd<Game & EMIT>;
  filter: <A extends any[]>(
    validator: (o: Game, ...args: A) => boolean,
    key?: string
  ) => (
    ...filter_args: A
  ) => {
    reduce: <EMIT_1>(
      ids: ('TABULA' | 'MILLERHOLLOW' | 'LIVE_TABULA' | 'LIVE_MILLERHOLLOW' | 'TROUBLE' | 'MISTERY' | 'VOV' | 'SECRET' | 'GAMEMASTER')[],
      emit: (o: EMIT_1) => void
    ) => import('svelte-map-reduce-store/fast-sort').SortCmd<Game & EMIT_1>;
    filter: any;
    sort: () => void;
    data: {
      list: Game[];
    };
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<{
        list: Game[];
      }>,
      invalidate?: (value?: { list: Game[] }) => void
    ) => import('svelte/store').Unsubscriber;
    validator: (o: Game, ...args: A) => boolean;
  };
  sort: () => void;
  format: () => {
    list: Game[];
  };
  data: {
    list: Game[];
  };
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      list: Game[];
    }>,
    invalidate?: (value?: { list: Game[] }) => void
  ) => import('svelte/store').Unsubscriber;
};
