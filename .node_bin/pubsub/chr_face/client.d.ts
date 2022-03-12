import { BOOK_FOLDER_IDX, MessageForFace, MessageForFaceMestype, MessageForFaceSowAuth, PotofForFace, PotofForFaceLive, PotofForFaceRole, PotofForFaceSowAuthMax } from '../map-reduce';
import type { DIC } from 'svelte-map-reduce-store';
declare type IN<T> = {
    [P in keyof T]?: T[P][];
};
export declare const potof_for_face: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
    }>) => string;
    index?: (_id: {
        face_id: string;
    }) => string | number | boolean;
    format: () => {
        list: PotofForFace[];
        by_face: DIC<PotofForFace>;
    };
    reduce: (o: {
        list: PotofForFace[];
        by_face: DIC<PotofForFace>;
    }, doc: PotofForFace) => void;
    order: (o: {
        list: PotofForFace[];
        by_face: DIC<PotofForFace>;
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }) => void;
};
export declare const potof_for_face_role: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
        role_id: import("../map-reduce").ROLE_ID;
    }>) => string;
    index?: (_id: {
        face_id: string;
        role_id: import("../map-reduce").ROLE_ID;
    }) => string | number | boolean;
    format: () => {
        list: PotofForFaceRole[];
        sum: number;
    };
    reduce: (o: {
        list: PotofForFaceRole[];
        sum: number;
    }, doc: PotofForFaceRole) => void;
    order: (o: {
        list: PotofForFaceRole[];
        sum: number;
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }) => void;
};
export declare const potof_for_face_live: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
        live: "leave" | "live" | "executed" | "victim" | "cursed" | "droop" | "suicide" | "feared" | "suddendead";
    }>) => string;
    index?: (_id: {
        face_id: string;
        live: "leave" | "live" | "executed" | "victim" | "cursed" | "droop" | "suicide" | "feared" | "suddendead";
    }) => string | number | boolean;
    format: () => {
        list: PotofForFaceLive[];
        sum: number;
    };
    reduce: (o: {
        list: PotofForFaceLive[];
        sum: number;
    }, doc: PotofForFaceLive) => void;
    order: (o: {
        list: PotofForFaceLive[];
        sum: number;
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }) => void;
};
export declare const potof_for_face_sow_auth_max: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
        sow_auth_id: string;
    }>) => string;
    index?: (_id: {
        face_id: string;
        sow_auth_id: string;
    }) => string | number | boolean;
    format: () => {
        list: PotofForFaceSowAuthMax[];
        by_face: DIC<PotofForFaceSowAuthMax>;
    };
    reduce: (o: {
        list: PotofForFaceSowAuthMax[];
        by_face: DIC<PotofForFaceSowAuthMax>;
    }, doc: PotofForFaceSowAuthMax) => void;
    order: (o: {
        list: PotofForFaceSowAuthMax[];
        by_face: DIC<PotofForFaceSowAuthMax>;
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }) => void;
};
export declare const message_for_face: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
    }>) => string;
    index?: (_id: {
        face_id: string;
    }) => string | number | boolean;
    format: () => {
        list: MessageForFace[];
        folder: (`${number}`[] & {
            _id: BOOK_FOLDER_IDX;
            nation: string;
        })[];
        by_face: DIC<MessageForFace>;
        by_folder: DIC<`${number}`[]>;
    };
    reduce: (o: {
        list: MessageForFace[];
        folder: (`${number}`[] & {
            _id: BOOK_FOLDER_IDX;
            nation: string;
        })[];
        by_face: DIC<MessageForFace>;
        by_folder: DIC<`${number}`[]>;
    }, doc: MessageForFace) => void;
    order: (o: {
        list: MessageForFace[];
        folder: (`${number}`[] & {
            _id: BOOK_FOLDER_IDX;
            nation: string;
        })[];
        by_face: DIC<MessageForFace>;
        by_folder: DIC<`${number}`[]>;
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }) => void;
};
export declare const message_for_face_mestype: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
        mestype: "CAST" | "ADMIN" | "MAKER" | "INFOSP" | "INFONOM" | "INFOWOLF" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "BSAY" | "SPSAY" | "SAY" | "DELETED";
    }>) => string;
    index?: (_id: {
        face_id: string;
        mestype: "CAST" | "ADMIN" | "MAKER" | "INFOSP" | "INFONOM" | "INFOWOLF" | "AIM" | "TSAY" | "WSAY" | "GSAY" | "VSAY" | "BSAY" | "SPSAY" | "SAY" | "DELETED";
    }) => string | number | boolean;
    format: () => {
        list: MessageForFaceMestype[];
    };
    reduce: (o: {
        list: MessageForFaceMestype[];
    }, doc: MessageForFaceMestype) => void;
    order: (o: {
        list: MessageForFaceMestype[];
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }) => void;
};
export declare const message_for_face_sow_auth: {
    name?: string;
    qid: (o: IN<{
        face_id: string;
        sow_auth_id: string;
    }>) => string;
    index?: (_id: {
        face_id: string;
        sow_auth_id: string;
    }) => string | number | boolean;
    format: () => {
        list: MessageForFaceSowAuth[];
    };
    reduce: (o: {
        list: MessageForFaceSowAuth[];
    }, doc: MessageForFaceSowAuth) => void;
    order: (o: {
        list: MessageForFaceSowAuth[];
    }, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }, order: string) => void;
};
export {};
