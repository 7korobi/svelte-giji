import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    mode?: 'image' | 'text';
    min?: number;
    max?: number;
    scale?: number;
    x?: number;
    y?: number;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type ZoomProps = typeof __propDef.props;
export declare type ZoomEvents = typeof __propDef.events;
export declare type ZoomSlots = typeof __propDef.slots;
export default class Zoom extends SvelteComponentTyped<ZoomProps, ZoomEvents, ZoomSlots> {}
export {};
