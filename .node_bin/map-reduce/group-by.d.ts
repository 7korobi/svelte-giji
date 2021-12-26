export declare function groupBy<T, U extends boolean>(list: T[], cb: (item: T) => 'true' | 'false'): {
    true?: T[];
    false?: T[];
};
export declare function groupBy<T, U extends string>(list: T[], cb: (item: T) => U): {
    [category in U]?: T[];
};
