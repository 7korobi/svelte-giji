import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        key?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type PageTransitionProps = typeof __propDef.props;
export declare type PageTransitionEvents = typeof __propDef.events;
export declare type PageTransitionSlots = typeof __propDef.slots;
export default class PageTransition extends SvelteComponentTyped<PageTransitionProps, PageTransitionEvents, PageTransitionSlots> {
}
export {};
