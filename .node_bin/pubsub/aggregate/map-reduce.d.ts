import type { STORY_ID } from '../book_story/map-reduce';
import type { RoleType, LiveType } from '../_type/enum';
import type { AccountID, FaceID } from '../_type/id';
import type { presentation } from '../_type/string';
import type { FOLDER_IDX, MESSAGE_TYPE_IDX, MesType } from '../map-reduce';
export declare type MessageForFace = {
  _id: {
    face_id: FaceID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: STORY_ID[];
  max: number;
  all: number;
  count: number;
};
export declare type MessageForFaceMestype = {
  _id: {
    face_id: FaceID;
    mestype: MESSAGE_TYPE_IDX;
  };
  date_min: Date;
  date_max: Date;
  story_ids: STORY_ID[];
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
  story_ids: STORY_ID[];
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
  story_ids: STORY_ID[];
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
  story_ids: STORY_ID[];
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
  story_ids: STORY_ID[];
};
export declare type PotofForFaceSowAuthMax = {
  _id: {
    face_id: FaceID;
    sow_auth_id: AccountID;
  };
  date_min: Date;
  date_max: Date;
  story_ids: STORY_ID[];
  count: number;
};
export declare type PotofForFaceRole = {
  _id: {
    face_id: FaceID;
    role_id: RoleType;
  };
  date_min: Date;
  date_max: Date;
  story_ids: STORY_ID[];
};
export declare type PotofForFaceLive = {
  _id: {
    face_id: FaceID;
    live: LiveType;
  };
  date_min: Date;
  date_max: Date;
  story_ids: STORY_ID[];
};
export declare type Aggregate = {
  folders: FOLDER_IDX;
  roles: RoleType[];
  lives: LiveType[];
  sow_auths: presentation[];
  mestypes: MesType[];
  log: {
    story_ids: STORY_ID[];
    date_max: Date;
    date_min: Date;
  };
  fav: {
    _id: {
      sow_auth_id?: presentation;
    };
    count: number;
  };
};
export declare const potof_for_faces: {
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
