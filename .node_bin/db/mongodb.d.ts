import type { DeleteResult, Document, ModifyResult } from 'mongodb';
import type { DIC } from 'svelte-map-reduce-store';
import { Collection } from 'mongodb';
export declare function db(): import('mongodb').Db;
export declare function dbBoot(url: string): Promise<void>;
export declare function watch<K, T>(
  set: (docs: T) => void,
  del: (ids: K) => void,
  model: Collection<T>,
  pipeline: Document[]
): import('mongodb').ChangeStream<T>;
export declare function modelAsMongoDB<
  T extends {
    _id: any;
  }
>(
  collection: string,
  $project?: DIC<0> | DIC<1>
): {
  $match: (
    ids: T['_id'][]
  ) => {
    _id: {
      $in: T['_id'][];
    };
  };
  set: ($set: T) => Promise<ModifyResult<T>>;
  del: (ids: T['_id'][]) => Promise<DeleteResult>;
  isLive: () => Promise<boolean>;
  live: (
    $match: any,
    set: ($set: T) => Promise<ModifyResult<T>>,
    del: (ids: T['_id'][]) => Promise<DeleteResult>
  ) => import('mongodb').ChangeStream<T>;
  query: ($match: any) => Promise<Document[]>;
};
