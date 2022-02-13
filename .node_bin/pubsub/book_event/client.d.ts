import type { BookEvent } from '../map-reduce';
export declare const events: {
  name?: string;
  qid: (ids: (`${string}-${number}-${number}` | `${string}-${number}-top`)[]) => string;
  index?: (_id: `${string}-${number}-${number}` | `${string}-${number}-top`) => string;
  format: () => {
    list: BookEvent[];
  };
  reduce: (
    o: {
      list: BookEvent[];
    },
    doc: BookEvent
  ) => void;
  order: (
    o: {
      list: BookEvent[];
    },
    {
      sort,
      group_sort
    }: {
      sort: typeof import('svelte-map-reduce-store').sort;
      group_sort: typeof import('svelte-map-reduce-store').group_sort;
    }
  ) => void;
};
