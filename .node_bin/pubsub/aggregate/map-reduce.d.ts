import type { AccountID, FaceID } from '../_type/id';
import type { Role, MesType, LIVE_ID, ROLE_ID, BOOK_STORY_ID } from '../map-reduce';
export declare type MessageForFace = {
  _id: {
    face_id: FaceID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
  max: number;
  all: number;
  count: number;
};
export declare type MessageForFaceMestype = {
  _id: {
    face_id: FaceID;
    mestype: MesType;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
  per: number;
  max: number;
  all: number;
  count: number;
};
export declare type MessageForFaceSowAuth = {
  _id: {
    face_id: FaceID;
    sow_auth_id: AccountID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
  max: number;
  all: number;
  count: number;
};
export declare type MessageForFaceLive = {
  _id: {
    face_id: FaceID;
    sow_auth_id: AccountID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
  max: number;
  all: number;
  count: number;
};
export declare type MessageForFaceRole = {
  _id: {
    face_id: FaceID;
    sow_auth_id: AccountID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
  max: number;
  all: number;
  count: number;
};
export declare type PotofForFace = {
  _id: {
    face_id: FaceID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
};
export declare type PotofForFaceSowAuthMax = {
  _id: {
    face_id: FaceID;
    sow_auth_id: AccountID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
  count: number;
};
export declare type PotofForFaceRole = {
  _id: {
    face_id: FaceID;
    role_id: ROLE_ID;
  };
  role: Role;
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
};
export declare type PotofForFaceLive = {
  _id: {
    face_id: FaceID;
    live: LIVE_ID;
  };
  live: Role;
  date_min: Date;
  date_max: Date;
  story_ids: BOOK_STORY_ID[];
};
export declare const potof_for_faces: {
  index?: (_id: { face_id: FaceID }) => unknown;
  format: () => {
    list: PotofForFace[];
  };
  reduce: (
    o: {
      list: PotofForFace[];
    },
    doc: PotofForFace
  ) => void;
  order: (
    o: {
      list: PotofForFace[];
    },
    {
      sort,
      group_sort
    }: {
      sort: typeof import('svelte-map-reduce-store').sort;
      group_sort: typeof import('svelte-map-reduce-store').group_sort;
    }
  ) => void;
};
