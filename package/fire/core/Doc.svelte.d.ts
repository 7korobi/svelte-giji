import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    path: any;
    log?: boolean;
    traceId?: string;
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
    };
    loading: {};
    fallback: {};
    after: {};
  };
};
export declare type DocProps = typeof __propDef.props;
export declare type DocEvents = typeof __propDef.events;
export declare type DocSlots = typeof __propDef.slots;
export default class Doc extends SvelteComponentTyped<DocProps, DocEvents, DocSlots> {}
export {};
