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
export declare type MainProps = typeof __propDef.props;
export declare type MainEvents = typeof __propDef.events;
export declare type MainSlots = typeof __propDef.slots;
export default class Main extends SvelteComponentTyped<MainProps, MainEvents, MainSlots> {
}
export {};
