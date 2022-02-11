export declare function fileDownloadStore(
  path: any,
  opts: any
): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: (value?: any) => void
  ) => import('svelte/store').Unsubscriber;
  storage: any;
  ref: any;
  readonly loading: boolean;
  readonly error: any;
};
export declare function uploadTaskStore(
  path: any,
  file: any,
  opts: any
): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: (value?: any) => void
  ) => import('svelte/store').Unsubscriber;
  storage: any;
  ref: any;
  readonly downloadURL: string;
  readonly task: any;
  readonly error: any;
};
