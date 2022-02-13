import type { ARY, DIC } from 'svelte-map-reduce-store';
import type { presentation } from '../_type/string';
import type { CHR_SET_IDX, Face } from '../map-reduce';
import json from '$lib/game/json/chr_tag.json';
export declare type TAG_ID = keyof typeof json;
export declare type Tag = {
  _id: TAG_ID;
  tag_id: string;
  chr_set_id: CHR_SET_IDX;
  order: number;
  label: presentation;
  long: presentation;
  head: presentation;
  faces: Face[];
  face_sort: ['face.order' | 'face.q.head', 'asc'];
};
export declare const Tags: {
  deploy: (json: any, init?: (doc: Tag) => void) => void;
  clear: () => void;
  add: (docs: Tag[], init?: (doc: Tag) => void) => void;
  del: (
    ids: (
      | 'all'
      | 'fable'
      | 'animal'
      | 'school'
      | 'giji'
      | 'G_a_k'
      | 'G_s_t'
      | 'G_n_h'
      | 'G_m_w'
      | 'travel'
      | 'T_h_w'
      | 'T_s_n'
      | 'marchen'
      | 'asia'
      | 'T_a_k'
      | 'myth'
      | 'stratos'
      | 'shoji'
    )[]
  ) => void;
  find: (
    _id:
      | 'all'
      | 'fable'
      | 'animal'
      | 'school'
      | 'giji'
      | 'G_a_k'
      | 'G_s_t'
      | 'G_n_h'
      | 'G_m_w'
      | 'travel'
      | 'T_h_w'
      | 'T_s_n'
      | 'marchen'
      | 'asia'
      | 'T_a_k'
      | 'myth'
      | 'stratos'
      | 'shoji'
  ) => Tag;
  index: (
    _id:
      | 'all'
      | 'fable'
      | 'animal'
      | 'school'
      | 'giji'
      | 'G_a_k'
      | 'G_s_t'
      | 'G_n_h'
      | 'G_m_w'
      | 'travel'
      | 'T_h_w'
      | 'T_s_n'
      | 'marchen'
      | 'asia'
      | 'T_a_k'
      | 'myth'
      | 'stratos'
      | 'shoji'
  ) => unknown;
  reduce: <EMIT>(
    ids: (
      | 'all'
      | 'fable'
      | 'animal'
      | 'school'
      | 'giji'
      | 'G_a_k'
      | 'G_s_t'
      | 'G_n_h'
      | 'G_m_w'
      | 'travel'
      | 'T_h_w'
      | 'T_s_n'
      | 'marchen'
      | 'asia'
      | 'T_a_k'
      | 'myth'
      | 'stratos'
      | 'shoji'
    )[],
    emit: (o: EMIT) => void
  ) => import('svelte-map-reduce-store/fast-sort').SortCmd<Tag & EMIT>;
  filter: <A extends any[]>(
    validator: (o: Tag, ...args: A) => boolean,
    key?: string
  ) => (
    ...filter_args: A
  ) => {
    reduce: <EMIT_1>(
      ids: (
        | 'all'
        | 'fable'
        | 'animal'
        | 'school'
        | 'giji'
        | 'G_a_k'
        | 'G_s_t'
        | 'G_n_h'
        | 'G_m_w'
        | 'travel'
        | 'T_h_w'
        | 'T_s_n'
        | 'marchen'
        | 'asia'
        | 'T_a_k'
        | 'myth'
        | 'stratos'
        | 'shoji'
      )[],
      emit: (o: EMIT_1) => void
    ) => import('svelte-map-reduce-store/fast-sort').SortCmd<Tag & EMIT_1>;
    filter: any;
    sort: () => void;
    data: {
      list: Tag[];
      base: DIC<
        DIC<{
          list: Tag[];
        }>
      >;
      group: ARY<
        ARY<{
          list: Tag[];
        }>
      >;
    };
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<{
        list: Tag[];
        base: DIC<
          DIC<{
            list: Tag[];
          }>
        >;
        group: ARY<
          ARY<{
            list: Tag[];
          }>
        >;
      }>,
      invalidate?: (value?: {
        list: Tag[];
        base: DIC<
          DIC<{
            list: Tag[];
          }>
        >;
        group: ARY<
          ARY<{
            list: Tag[];
          }>
        >;
      }) => void
    ) => import('svelte/store').Unsubscriber;
    validator: (o: Tag, ...args: A) => boolean;
  };
  sort: () => void;
  format: () => {
    list: Tag[];
    base: DIC<
      DIC<{
        list: Tag[];
      }>
    >;
    group: ARY<
      ARY<{
        list: Tag[];
      }>
    >;
  };
  data: {
    list: Tag[];
    base: DIC<
      DIC<{
        list: Tag[];
      }>
    >;
    group: ARY<
      ARY<{
        list: Tag[];
      }>
    >;
  };
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<{
      list: Tag[];
      base: DIC<
        DIC<{
          list: Tag[];
        }>
      >;
      group: ARY<
        ARY<{
          list: Tag[];
        }>
      >;
    }>,
    invalidate?: (value?: {
      list: Tag[];
      base: DIC<
        DIC<{
          list: Tag[];
        }>
      >;
      group: ARY<
        ARY<{
          list: Tag[];
        }>
      >;
    }) => void
  ) => import('svelte/store').Unsubscriber;
};
