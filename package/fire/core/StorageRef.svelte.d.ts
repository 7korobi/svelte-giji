import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    path?: string;
    log?: boolean;
    traceId?: string;
    startWith?: any;
    url?: boolean;
    meta?: boolean;
  };
  events: {
    ref: CustomEvent<any>;
    storageResult: CustomEvent<any>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    before: {};
    default: {
      downloadURL: any;
      metadata: any;
      ref: any;
      error: any;
    };
    loading: {};
    fallback: {};
    after: {};
  };
};
export declare type StorageRefProps = typeof __propDef.props;
export declare type StorageRefEvents = typeof __propDef.events;
export declare type StorageRefSlots = typeof __propDef.slots;
export default class StorageRef extends SvelteComponentTyped<StorageRefProps, StorageRefEvents, StorageRefSlots> {}
export {};
