import { SvelteComponentTyped } from 'svelte';
import type { RANGE } from './observer';
declare const __propDef: {
  props: {
    name?: string;
    range?: RANGE[];
    focus?: string;
    state?: string;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type ScrollProps = typeof __propDef.props;
export declare type ScrollEvents = typeof __propDef.events;
export declare type ScrollSlots = typeof __propDef.slots;
export default class Scroll extends SvelteComponentTyped<ScrollProps, ScrollEvents, ScrollSlots> {}
export {};
