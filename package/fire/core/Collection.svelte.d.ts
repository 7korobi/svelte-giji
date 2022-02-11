import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    path: any;
    query?: any;
    traceId?: string;
    log?: boolean;
    startWith?: any;
    maxWait?: number;
    once?: boolean;
  };
  events: {
    ref: CustomEvent<any>;
    data: CustomEvent<any>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    before: {};
    default: {
      data: any;
      ref: any;
      error: any;
      first: any;
      last: any;
    };
    loading: {};
    fallback: {};
    after: {};
  };
};
export declare type CollectionProps = typeof __propDef.props;
export declare type CollectionEvents = typeof __propDef.events;
export declare type CollectionSlots = typeof __propDef.slots;
export default class Collection extends SvelteComponentTyped<CollectionProps, CollectionEvents, CollectionSlots> {}
export {};
