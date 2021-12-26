import type { MessageForFace, MessageForFaceMestype, MessageForFaceSowAuth, PotofForFace, PotofForFaceLive, PotofForFaceRole, PotofForFaceSowAuthMax } from '../map-reduce';
import type { DIC } from '$lib/map-reduce';
export declare const potof_for_face: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
    }>) => string;
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
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const potof_for_face_role: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
        role_id: RoleType;
    }>) => string;
    format: () => {
        list: PotofForFaceRole[];
    };
    reduce: (o: {
        list: PotofForFaceRole[];
    }, doc: PotofForFaceRole) => void;
    order: (o: {
        list: PotofForFaceRole[];
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const potof_for_face_live: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
        live: LiveType;
    }>) => string;
    format: () => {
        list: PotofForFaceLive[];
    };
    reduce: (o: {
        list: PotofForFaceLive[];
    }, doc: PotofForFaceLive) => void;
    order: (o: {
        list: PotofForFaceLive[];
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const potof_for_face_sow_auth_max: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
        sow_auth_id: string;
    }>) => string;
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
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const message_for_face: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
    }>) => string;
    format: () => {
        list: MessageForFace[];
        by_face: DIC<MessageForFace>;
    };
    reduce: (o: {
        list: MessageForFace[];
        by_face: DIC<MessageForFace>;
    }, doc: MessageForFace) => void;
    order: (o: {
        list: MessageForFace[];
        by_face: DIC<MessageForFace>;
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const message_for_face_mestype: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
        mestype: MESSAGE_TYPE_IDX;
    }>) => string;
    format: () => {
        list: MessageForFaceMestype[];
    };
    reduce: (o: {
        list: MessageForFaceMestype[];
    }, doc: MessageForFaceMestype) => void;
    order: (o: {
        list: MessageForFaceMestype[];
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const message_for_face_sow_auth: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
        sow_auth_id: string;
    }>) => string;
    format: () => {
        list: MessageForFaceSowAuth[];
    };
    reduce: (o: {
        list: MessageForFaceSowAuth[];
    }, doc: MessageForFaceSowAuth) => void;
    order: (o: {
        list: MessageForFaceSowAuth[];
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export declare const message_for_face_by_face: {
    name?: string;
    qid: (o: Partial<{
        face_id: string;
    }>) => string;
    format: () => {
        list: MessageForFace[];
    };
    reduce: (o: {
        list: MessageForFace[];
    }, doc: MessageForFace) => void;
    order: (o: {
        list: MessageForFace[];
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
