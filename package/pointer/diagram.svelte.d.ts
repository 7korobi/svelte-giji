import { SvelteComponentTyped } from "svelte";
import type { Cluster, Icon, Line } from './store';
declare const __propDef: {
    props: {
        pin?: string;
        clusters?: Cluster[];
        icons?: Icon[];
        lines?: Line[];
        min?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        edit?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type DiagramProps = typeof __propDef.props;
export declare type DiagramEvents = typeof __propDef.events;
export declare type DiagramSlots = typeof __propDef.slots;
export default class Diagram extends SvelteComponentTyped<DiagramProps, DiagramEvents, DiagramSlots> {
}
export {};
