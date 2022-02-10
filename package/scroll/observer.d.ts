export declare type RANGE = RANGE_STATE | 'focus' | 'horizon' | 'vertical' | 'box';
declare type RANGE_STATE = 'compress' | 'hidden' | 'peep' | 'show';
export declare const bit: {
    focus: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
};
declare type OperationsElement = HTMLDivElement & {
    tracker: Operations;
};
declare type UseListener = {
    (this: Operations, el: HTMLDivElement): {
        destroy: () => void;
    };
};
interface OperationsOptions {
    change?: (ops: Operations) => void;
}
declare class Operations {
    focus?: number;
    state?: RANGE_STATE;
    el: OperationsElement;
    options: OperationsOptions;
    listener: UseListener;
    constructor(options: OperationsOptions, listener: UseListener);
    setOptions({ change }: OperationsOptions): this;
}
export declare const observe: (range: RANGE[], options: OperationsOptions) => Operations;
export {};
