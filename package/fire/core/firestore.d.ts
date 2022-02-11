export declare function docStore(
  path: any,
  opts: any
): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: (value?: any) => void
  ) => import('svelte/store').Unsubscriber;
  firestore: any;
  ref: any;
  readonly loading: boolean;
  readonly error: any;
};
export declare function collectionStore(
  path: any,
  queryFn: any,
  opts: any
): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: (value?: any) => void
  ) => import('svelte/store').Unsubscriber;
  firestore: any;
  ref: any;
  readonly loading: boolean;
  readonly error: any;
  readonly meta: {};
};
