import type { ObjectId } from 'mongodb';
import type { BookPotof } from '../map-reduce';
export declare const potofs: {
  name?: string;
  qid: (ids: ObjectId[]) => string;
  format: () => {
    list: BookPotof[];
  };
  reduce: (
    o: {
      list: BookPotof[];
    },
    doc: BookPotof
  ) => void;
  order: (
    o: {
      list: BookPotof[];
    },
    {
      sort,
      group_sort
    }: {
      sort: typeof import('svelte-map-reduce-store').sort;
      group_sort: typeof import('svelte-map-reduce-store').group_sort;
    },
    is_asc: boolean,
    order: (o: BookPotof) => any
  ) => void;
};
