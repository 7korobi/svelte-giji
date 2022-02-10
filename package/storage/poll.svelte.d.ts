import { SvelteComponentTyped } from "svelte";
import type { WebPollData } from './dexie';
declare const __propDef: {
    props: {
        version?: string;
        timer?: string;
        shift?: string;
        idx?: string;
        onFetch?: (pack: any) => void;
        pack?: any;
        next_at?: number;
        api_call?: () => Promise<WebPollData<any>>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type PollProps = typeof __propDef.props;
export declare type PollEvents = typeof __propDef.events;
export declare type PollSlots = typeof __propDef.slots;
export default class Poll extends SvelteComponentTyped<PollProps, PollEvents, PollSlots> {
}
export {};
