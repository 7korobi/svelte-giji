import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    path: any;
    file: any;
    log?: boolean;
    traceId?: string;
  };
  events: {
    ref: CustomEvent<any>;
    snapshot: CustomEvent<any>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    before: {};
    default: {
      snapshot: any;
      ref: any;
      task: any;
      downloadURL: string;
      error: any;
    };
    fallback: {};
    complete: {};
    after: {};
  };
};
export declare type UploadTaskProps = typeof __propDef.props;
export declare type UploadTaskEvents = typeof __propDef.events;
export declare type UploadTaskSlots = typeof __propDef.slots;
export default class UploadTask extends SvelteComponentTyped<UploadTaskProps, UploadTaskEvents, UploadTaskSlots> {}
export {};
