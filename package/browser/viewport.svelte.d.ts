import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        min: number;
        max: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ViewportProps = typeof __propDef.props;
export declare type ViewportEvents = typeof __propDef.events;
export declare type ViewportSlots = typeof __propDef.slots;
export default class Viewport extends SvelteComponentTyped<ViewportProps, ViewportEvents, ViewportSlots> {
}
export {};
