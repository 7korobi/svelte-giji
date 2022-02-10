import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        at?: number | Date;
        limit?: string;
        format?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type TimeProps = typeof __propDef.props;
export declare type TimeEvents = typeof __propDef.events;
export declare type TimeSlots = typeof __propDef.slots;
export default class Time extends SvelteComponentTyped<TimeProps, TimeEvents, TimeSlots> {
}
export {};
