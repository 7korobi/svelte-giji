export declare const messages: {
    name?: string;
    qid: (ids: `${string}-${number}`[]) => string;
    index?: (_id: any) => string | number | boolean;
    format: () => import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>;
    reduce: (o: import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>, doc: import("svelte-map-reduce-store").BaseT<any>) => void;
    order: (o: import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }, ...args: any[]) => void;
};
