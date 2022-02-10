import type { MessageForFace, MessageForFaceMestype, MessageForFaceSowAuth, PotofForFace, PotofForFaceLive, PotofForFaceRole, PotofForFaceSowAuthMax } from '../map-reduce';
export declare const potof_for_face: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: PotofForFace) => Promise<import("mongodb").ModifyResult<PotofForFace>>, del: (ids: {
        face_id: string;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<PotofForFace>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
export declare const potof_for_face_role: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: PotofForFaceRole) => Promise<import("mongodb").ModifyResult<PotofForFaceRole>>, del: (ids: {
        face_id: string;
        role_id: RoleType;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<PotofForFaceRole>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
        role_id: RoleType;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
export declare const potof_for_face_live: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: PotofForFaceLive) => Promise<import("mongodb").ModifyResult<PotofForFaceLive>>, del: (ids: {
        face_id: string;
        live: LiveType;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<PotofForFaceLive>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
        live: LiveType;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
export declare const potof_for_face_sow_auth_max: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: PotofForFaceSowAuthMax) => Promise<import("mongodb").ModifyResult<PotofForFaceSowAuthMax>>, del: (ids: {
        face_id: string;
        sow_auth_id: string;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<PotofForFaceSowAuthMax>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
        sow_auth_id: string;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
export declare const message_for_face: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: MessageForFace) => Promise<import("mongodb").ModifyResult<MessageForFace>>, del: (ids: {
        face_id: string;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<MessageForFace>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
export declare const message_for_face_mestype: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: MessageForFaceMestype) => Promise<import("mongodb").ModifyResult<MessageForFaceMestype>>, del: (ids: {
        face_id: string;
        mestype: MESSAGE_TYPE_IDX;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<MessageForFaceMestype>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
        mestype: MESSAGE_TYPE_IDX;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
export declare const message_for_face_sow_auth: {
    isLive: () => Promise<boolean>;
    live: ($match: any, set: ($set: MessageForFaceSowAuth) => Promise<import("mongodb").ModifyResult<MessageForFaceSowAuth>>, del: (ids: {
        face_id: string;
        sow_auth_id: string;
    }[]) => Promise<import("mongodb").DeleteResult>) => import("mongodb").ChangeStream<MessageForFaceSowAuth>;
    query: ($match: any) => Promise<import("mongodb").Document[]>;
    $match(o: {
        face_id: string;
        sow_auth_id: string;
    }): {
        [x: `_id.${string}`]: {
            $in: string[];
        };
    };
};
