declare type top = number;
declare type left = number;
declare type width = number;
declare type height = number;
declare type scale = number;
declare type SIZE = [width, height];
declare type POINT = [left, top];
declare type POINT_WITH_SCALE = [left, top, scale];
declare type OperationCallback<T extends HTMLElement, E, R> = (ops: Operations<T>, event: E) => R;
interface OperationsOptions<T extends HTMLElement> {
    start?: OperationCallback<T, InputEvent, boolean>;
    move?: OperationCallback<T, InputEvent, void>;
    end?: OperationCallback<T, InputEvent, void>;
    change?: OperationCallback<T, InputEvent, void>;
    wheel?: OperationCallback<T, WheelEvent, void>;
    rawUpdates?: boolean;
}
declare type OperationDiff = {
    point: POINT[];
    distance: number[];
    radian: number[];
    degree: number[];
    pan: POINT[];
    wheel: POINT_WITH_SCALE[];
};
export declare type InputEvent = TouchEvent | PointerEvent | MouseEvent;
export declare class Operation {
    id: number;
    point: POINT;
    points: POINT[];
    constructor(event: Touch | PointerEvent | MouseEvent, offset: POINT);
}
export declare class Operations<T extends HTMLElement> {
    options: OperationsOptions<T>;
    handlerEl: T;
    originEl: T;
    size: SIZE;
    offset: POINT;
    wheel: POINT_WITH_SCALE;
    tracked: Operation[];
    current: Operation[];
    changed: Operation[];
    constructor(options: OperationsOptions<T>);
    relationGap(start?: number, end?: any): OperationDiff;
    updateByRect(): this;
    setOptions({ start, move, end, change, wheel, rawUpdates }: OperationsOptions<T>): this;
    listener: (node: T) => {
        destroy(): void;
    };
}
export {};
