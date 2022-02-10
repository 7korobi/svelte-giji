declare type top = number;
declare type right = number;
declare type bottom = number;
declare type left = number;
declare type width = number;
declare type height = number;
declare type SIZE = [width, height];
declare type POINT = [left, top];
declare type OFFSET = [top, right, bottom, left];
declare class AreaBox {
    size: SIZE;
    point: POINT;
    offset: OFFSET;
    constructor({ width, height, scale }: {
        width: any;
        height: any;
        scale: any;
    });
    measureSize(width: number, height: number): void;
    measureOffset(top: number, right: number, bottom: number, left: number): void;
}
export declare const state: {
    isActive: boolean;
    isOnline: boolean;
    isWatching: boolean;
    isKeypad: boolean;
    isPortrait: boolean;
    isLandscape: boolean;
    isZoom: boolean;
    keys: any[];
    scale: number;
    keypad: {
        size: SIZE;
    };
    zoom: AreaBox;
    view: AreaBox;
    safe: AreaBox;
};
export declare const isActive: import("svelte/store").Writable<boolean>;
export declare const isOnline: import("svelte/store").Writable<boolean>;
export declare const isWatching: import("svelte/store").Writable<boolean>;
export declare const isKeypad: import("svelte/store").Writable<boolean>;
export declare const isPortrait: import("svelte/store").Writable<boolean>;
export declare const isLandscape: import("svelte/store").Writable<boolean>;
export declare const isZoom: import("svelte/store").Writable<boolean>;
export declare const keys: import("svelte/store").Writable<any[]>;
export declare const zoomScale: import("svelte/store").Writable<number>;
export declare const zoomPoint: import("svelte/store").Writable<POINT>;
export declare const viewPoint: import("svelte/store").Writable<POINT>;
export declare const safePoint: import("svelte/store").Writable<POINT>;
export declare const zoomOffset: import("svelte/store").Writable<OFFSET>;
export declare const viewOffset: import("svelte/store").Writable<OFFSET>;
export declare const safeOffset: import("svelte/store").Writable<OFFSET>;
export declare const keypadSize: import("svelte/store").Writable<SIZE>;
export declare const zoomSize: import("svelte/store").Writable<SIZE>;
export declare const viewSize: import("svelte/store").Writable<SIZE>;
export declare const safeSize: import("svelte/store").Writable<SIZE>;
export {};
