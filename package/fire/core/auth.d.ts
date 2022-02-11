export declare function userStore(opts?: {
  persist: any;
}): {
  subscribe: (
    this: void,
    run: import('svelte/store').Subscriber<any>,
    invalidate?: (value?: any) => void
  ) => import('svelte/store').Unsubscriber;
  auth: any;
};
