import type { Server } from 'socket.io';
import type { ChangeStream, DeleteResult, Document, ModifyResult } from 'mongodb';
import type { BaseStoreEntry } from './socket.io-client';
export { modelAsMongoDB } from './mongodb';
declare type ModelQuery<T, MatchArgs extends any[], MatchReturn> = {
    $match(...args: MatchArgs): MatchReturn;
    query($match: MatchReturn): Promise<T[]>;
};
declare type ModelLive<T extends Document, MatchArgs extends any[], MatchReturn> = {
    $match(...args: MatchArgs): MatchReturn;
    query($match: MatchReturn): Promise<T[]>;
    isLive(...args: MatchArgs): Promise<boolean>;
    live($match: MatchReturn, set: (docs: T[]) => void, del: (ids: T['_id'][]) => void): ChangeStream<T>;
    set(doc: T): Promise<ModifyResult<T>>;
    del(ids: T['_id'][]): Promise<DeleteResult>;
};
declare type ModelEntry<T, MatchArgs extends any[], MatchReturn> = ModelQuery<T, MatchArgs, MatchReturn> | ModelLive<T, MatchArgs, MatchReturn>;
export declare type BaseModelEntry = ModelLive<Document, any[], Document>;
declare let STORE: {
    [name: string]: BaseStoreEntry;
};
export declare function exit(name: string, ...args: any[]): void;
export declare function set(name: string, docs: Document[]): Promise<void>;
export declare function del(name: string, ids: any[]): Promise<void>;
export declare function getApi(name: string, ...args: any[]): string;
export declare function model<T, MatchArgs extends any[], MatchReturn>(o: ModelEntry<T, MatchArgs, MatchReturn>): ModelEntry<T, MatchArgs, MatchReturn>;
export default function listen(socketio: Server, models: {
    [api: string]: ModelEntry<Document, any[], any>;
}, stores: typeof STORE): void;
