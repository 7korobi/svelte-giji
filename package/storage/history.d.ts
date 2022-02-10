export declare function writeHistory<T>(init: T[], property: (o: T) => number | string): {
    add(value: T): void;
    subscribe: (this: void, run: import("svelte/store").Subscriber<T[]>, invalidate?: (value?: T[]) => void) => import("svelte/store").Unsubscriber;
};
