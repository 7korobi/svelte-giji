import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    topic: any;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type FireNotifyProps = typeof __propDef.props;
export declare type FireNotifyEvents = typeof __propDef.events;
export declare type FireNotifySlots = typeof __propDef.slots;
export default class FireNotify extends SvelteComponentTyped<FireNotifyProps, FireNotifyEvents, FireNotifySlots> {}
export {};
