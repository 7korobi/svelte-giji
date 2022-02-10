import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        ratio: number;
        isDefaultSafeArea: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type SafeMeasureProps = typeof __propDef.props;
export declare type SafeMeasureEvents = typeof __propDef.events;
export declare type SafeMeasureSlots = typeof __propDef.slots;
export default class SafeMeasure extends SvelteComponentTyped<SafeMeasureProps, SafeMeasureEvents, SafeMeasureSlots> {
}
export {};
