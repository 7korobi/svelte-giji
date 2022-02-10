/** @typedef {typeof __propDef.props}  KeyCaptureProps */
/** @typedef {typeof __propDef.events}  KeyCaptureEvents */
/** @typedef {typeof __propDef.slots}  KeyCaptureSlots */
export default class KeyCapture extends SvelteComponentTyped<{
    disabled?: boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type KeyCaptureProps = typeof __propDef.props;
export type KeyCaptureEvents = typeof __propDef.events;
export type KeyCaptureSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        disabled?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
