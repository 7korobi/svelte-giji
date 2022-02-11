import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    get: any;
  };
  events: {
    initializeApp: CustomEvent<any>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    default: {};
  };
};
export declare type FirebaseAppProps = typeof __propDef.props;
export declare type FirebaseAppEvents = typeof __propDef.events;
export declare type FirebaseAppSlots = typeof __propDef.slots;
export default class FirebaseApp extends SvelteComponentTyped<FirebaseAppProps, FirebaseAppEvents, FirebaseAppSlots> {}
export {};
