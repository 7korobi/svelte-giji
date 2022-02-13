import type { RANDOM_TYPE, Random } from '../map-reduce';
export declare const randoms: {
  name?: string;
  qid: (types: RANDOM_TYPE[]) => string;
  index?: (_id: string | number) => string;
  format: () => {
    list: Random[];
    sum: number;
  };
  reduce: (
    o: {
      list: Random[];
      sum: number;
    },
    doc: Random
  ) => void;
  order: (
    o: {
      list: Random[];
      sum: number;
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
