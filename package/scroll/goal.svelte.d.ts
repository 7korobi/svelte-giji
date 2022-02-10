import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        onPeep?: () => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type GoalProps = typeof __propDef.props;
export declare type GoalEvents = typeof __propDef.events;
export declare type GoalSlots = typeof __propDef.slots;
export default class Goal extends SvelteComponentTyped<GoalProps, GoalEvents, GoalSlots> {
}
export {};
