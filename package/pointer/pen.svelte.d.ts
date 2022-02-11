import { SvelteComponentTyped } from 'svelte';
import type { POINT } from 'svelte-petit-utils';
declare const __propDef: {
  props: {
    style?: string;
    weight?: number;
    operations?: {
      type: 'line';
      weight: number;
      size: POINT;
      points: POINT[];
    }[];
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type PenProps = typeof __propDef.props;
export declare type PenEvents = typeof __propDef.events;
export declare type PenSlots = typeof __propDef.slots;
export default class Pen extends SvelteComponentTyped<PenProps, PenEvents, PenSlots> {}
export {};
