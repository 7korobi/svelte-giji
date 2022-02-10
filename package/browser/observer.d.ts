declare type width = number;
declare type height = number;
declare type SIZE = [width, height];
declare type ElementResize = (rect: SIZE) => any;
export declare function onResize(el: HTMLElement, cb: ElementResize): {
    update: (newCb: ElementResize) => void;
    destroy: () => void;
};
export {};
