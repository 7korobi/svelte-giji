import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    persist?: any;
  };
  events: {
    user: CustomEvent<any>;
  } & {
    [evt: string]: CustomEvent<any>;
  };
  slots: {
    before: {};
    default: {
      user: any;
      auth: any;
    };
    'signed-out': {};
    after: {};
  };
};
export declare type UserProps = typeof __propDef.props;
export declare type UserEvents = typeof __propDef.events;
export declare type UserSlots = typeof __propDef.slots;
export default class User extends SvelteComponentTyped<UserProps, UserEvents, UserSlots> {}
export {};
