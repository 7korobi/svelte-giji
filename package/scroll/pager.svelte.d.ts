import { SvelteComponentTyped } from 'svelte';
import { RANGE } from './observer';
declare const __propDef: {
  props: {
    range?: RANGE[];
    chunk?: number;
    id?: (o: any) => string;
    base?: (o: any) => string;
    list?: any[];
    focus?: string;
    page?: number;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    page: {
      page: any;
    };
    default: {
      item: any;
    };
  };
};
export declare type PagerProps = typeof __propDef.props;
export declare type PagerEvents = typeof __propDef.events;
export declare type PagerSlots = typeof __propDef.slots;
export default class Pager extends SvelteComponentTyped<PagerProps, PagerEvents, PagerSlots> {}
export {};
