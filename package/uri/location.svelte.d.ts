import { SvelteComponentTyped } from 'svelte';
declare const __propDef: {
  props: {
    [x: string]: any;
    refresh?: any;
    searchParams?: {
      [key: string]: string | string[];
    };
    hash?: string;
    protocol?: string;
    host?: string;
    port?: number;
    hostname?: string;
    pathname?: string;
    href?: string;
    origin?: string;
    username?: string;
    password?: string;
  };
  events: {
    [evt: string]: CustomEvent<any>;
  };
  slots: {};
};
export declare type LocationProps = typeof __propDef.props;
export declare type LocationEvents = typeof __propDef.events;
export declare type LocationSlots = typeof __propDef.slots;
export default class Location extends SvelteComponentTyped<LocationProps, LocationEvents, LocationSlots> {}
export {};
