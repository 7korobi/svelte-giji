import Dexie from 'dexie';
export declare type WebPollData<T> = {
    version: string;
    idx: string;
    next_at?: number;
    next_time?: string;
    pack: T;
};
declare class WebPoll extends Dexie {
    data: Dexie.Table<WebPollData<any>, string>;
}
export declare let webPoll: WebPoll;
export {};
