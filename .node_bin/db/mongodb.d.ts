import type { Document } from 'mongodb';
import { Collection } from 'mongodb';
export declare function db(): import("mongodb").Db;
export declare function dbBoot(url: string): Promise<void>;
export declare function watch<K, T>(set: (docs: T) => void, del: (ids: K) => void, model: Collection<T>, pipeline: Document[]): import("mongodb").ChangeStream<T>;
