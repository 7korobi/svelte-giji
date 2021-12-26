import type { Plan } from '../map-reduce';
export declare const new_plans: {
    name?: string;
    qid: () => string;
    format: () => {
        list: Plan[];
        count: number;
    };
    reduce: (o: {
        list: Plan[];
        count: number;
    }, doc: Plan) => void;
    order: (o: {
        list: Plan[];
        count: number;
    }, { sort, group_sort }: {
        sort: typeof import("../../map-reduce").sort;
        group_sort: typeof import("../../map-reduce").group_sort;
    }) => void;
};
