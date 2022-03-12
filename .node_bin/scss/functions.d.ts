import sass from 'sass';
declare type FunctionsType = {
    [key: string]: (...args: sass.types.SassType[]) => sass.types.SassType | void;
};
declare const functions: FunctionsType;
export declare function save(): void;
export declare const results: any[];
export default functions;
