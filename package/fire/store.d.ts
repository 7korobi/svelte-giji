import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { User } from 'firebase/auth';
export declare const topicsAck: any;
export declare const topics: any;
export declare const token: import('svelte/store').Writable<string>;
export declare const app: import('svelte/store').Writable<FirebaseApp>;
export declare const user: import('svelte/store').Writable<User>;
export declare const error: import('svelte/store').Writable<Error>;
export declare function init(options: FirebaseOptions, name?: string): void;
