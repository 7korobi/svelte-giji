import { SvelteComponentTyped } from "svelte";
import type { RANGE } from './observer';
declare const __propDef: {
    props: {
        base?: string;
        id?: string;
        value?: string;
        range?: RANGE[];
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type FocusProps = typeof __propDef.props;
export declare type FocusEvents = typeof __propDef.events;
export declare type FocusSlots = typeof __propDef.slots;
export default class Focus extends SvelteComponentTyped<FocusProps, FocusEvents, FocusSlots> {
}
export {};
