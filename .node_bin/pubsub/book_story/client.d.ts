import type { DIC } from '$lib/map-reduce';
import type { BookStory, MobRole, Mark, Game, SayLimit, Role, Option, ROLE_ID } from '../map-reduce';
declare type CountBy = DIC<{
    count: number;
}>;
declare type Counts = {
    _id: string;
    count: number;
}[];
export declare function default_story_query(): {
    search: string;
    idx: string;
    mode: string;
    hide: any[];
};
export declare function default_stories_query(): {
    search: string;
    order: string;
    folder_id: ("rp" | "test" | "lobby" | "offparty" | "wolf" | "allstar" | "ultimate" | "cabala" | "morphe" | "soybean" | "pretense" | "perjury" | "xebec" | "crazy" | "ciel" | "dais")[];
    monthry: string[];
    upd_range: string[];
    upd_at: string[];
    sow_auth_id: string[];
    mark: ("love" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "cat" | "music" | "appare")[];
    size: string[];
    say_limit: ("lobby" | "say5" | "wbbs" | "euro" | "weak" | "juna" | "infinity" | "sow" | "say1" | "say5x200" | "say5x300" | "saving" | "tiny" | "vulcan" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid")[];
    game: ("TABULA" | "MILLERHOLLOW" | "LIVE_TABULA" | "LIVE_MILLERHOLLOW" | "TROUBLE" | "MISTERY" | "VOV" | "SECRET" | "GAMEMASTER")[];
    option: ("entrust" | "select-role" | "random-target" | "seq-event" | "show-id" | "undead-talk" | "aiming-talk")[];
    trap: ("blank" | "nothing" | "aprilfool" | "turnfink" | "turnfairy" | "eclipse" | "cointoss" | "force" | "miracle" | "prophecy" | "clamor" | "fire" | "nightmare" | "ghost" | "escape" | "seance")[];
    discard: ROLE_ID[];
    config: ROLE_ID[];
};
export declare const stories: {
    name?: string;
    qid: (ids: `${string}-${number}`[]) => string;
    format: () => {
        list: BookStory[];
        oldlog: DIC<BookStory[]>;
        base: {
            in_month: CountBy;
            yeary: CountBy;
            monthry: CountBy;
            folder_id: CountBy;
            upd_range: CountBy;
            upd_at: CountBy;
            sow_auth_id: CountBy;
            mark: DIC<{
                count: number;
            }>;
            size: CountBy;
            say_limit: DIC<{
                count: number;
            } & SayLimit>;
            game: DIC<{
                count: number;
            } & Game>;
            option: DIC<{
                count: number;
            } & Option>;
            mob_role: DIC<{
                count: number;
            } & MobRole>;
            trap: DIC<{
                count: number;
            } & Role>;
            config: DIC<{
                count: number;
            } & Role>;
            discard: DIC<{
                count: number;
            } & Role>;
        };
        group: {
            in_month: Counts;
            yeary: Counts;
            monthry: Counts;
            folder_id: Counts;
            upd_range: Counts;
            upd_at: {
                _id: string;
                count: number;
                at?: number;
            }[];
            sow_auth_id: Counts;
            mark: ({
                count: number;
            } & Mark)[];
            size: Counts;
            say_limit: ({
                count: number;
            } & SayLimit)[];
            game: ({
                count: number;
            } & Game)[];
            option: ({
                count: number;
            } & Option)[];
            mob_role: ({
                count: number;
            } & MobRole)[];
            trap: ({
                count: number;
            } & Role)[];
            config: ({
                count: number;
            } & Role)[];
            discard: ({
                count: number;
            } & Role)[];
        };
    };
    reduce: (o: {
        list: BookStory[];
        oldlog: DIC<BookStory[]>;
        base: {
            in_month: CountBy;
            yeary: CountBy;
            monthry: CountBy;
            folder_id: CountBy;
            upd_range: CountBy;
            upd_at: CountBy;
            sow_auth_id: CountBy;
            mark: DIC<{
                count: number;
            }>;
            size: CountBy;
            say_limit: DIC<{
                count: number;
            } & SayLimit>;
            game: DIC<{
                count: number;
            } & Game>;
            option: DIC<{
                count: number;
            } & Option>;
            mob_role: DIC<{
                count: number;
            } & MobRole>;
            trap: DIC<{
                count: number;
            } & Role>;
            config: DIC<{
                count: number;
            } & Role>;
            discard: DIC<{
                count: number;
            } & Role>;
        };
        group: {
            in_month: Counts;
            yeary: Counts;
            monthry: Counts;
            folder_id: Counts;
            upd_range: Counts;
            upd_at: {
                _id: string;
                count: number;
                at?: number;
            }[];
            sow_auth_id: Counts;
            mark: ({
                count: number;
            } & Mark)[];
            size: Counts;
            say_limit: ({
                count: number;
            } & SayLimit)[];
            game: ({
                count: number;
            } & Game)[];
            option: ({
                count: number;
            } & Option)[];
            mob_role: ({
                count: number;
            } & MobRole)[];
            trap: ({
                count: number;
            } & Role)[];
            config: ({
                count: number;
            } & Role)[];
            discard: ({
                count: number;
            } & Role)[];
        };
    }, doc: BookStory) => void;
    order: (o: {
        list: BookStory[];
        oldlog: DIC<BookStory[]>;
        base: {
            in_month: CountBy;
            yeary: CountBy;
            monthry: CountBy;
            folder_id: CountBy;
            upd_range: CountBy;
            upd_at: CountBy;
            sow_auth_id: CountBy;
            mark: DIC<{
                count: number;
            }>;
            size: CountBy;
            say_limit: DIC<{
                count: number;
            } & SayLimit>;
            game: DIC<{
                count: number;
            } & Game>;
            option: DIC<{
                count: number;
            } & Option>;
            mob_role: DIC<{
                count: number;
            } & MobRole>;
            trap: DIC<{
                count: number;
            } & Role>;
            config: DIC<{
                count: number;
            } & Role>;
            discard: DIC<{
                count: number;
            } & Role>;
        };
        group: {
            in_month: Counts;
            yeary: Counts;
            monthry: Counts;
            folder_id: Counts;
            upd_range: Counts;
            upd_at: {
                _id: string;
                count: number;
                at?: number;
            }[];
            sow_auth_id: Counts;
            mark: ({
                count: number;
            } & Mark)[];
            size: Counts;
            say_limit: ({
                count: number;
            } & SayLimit)[];
            game: ({
                count: number;
            } & Game)[];
            option: ({
                count: number;
            } & Option)[];
            mob_role: ({
                count: number;
            } & MobRole)[];
            trap: ({
                count: number;
            } & Role)[];
            config: ({
                count: number;
            } & Role)[];
            discard: ({
                count: number;
            } & Role)[];
        };
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }, order: {
        search: string;
        order: string;
        folder_id: ("rp" | "test" | "lobby" | "offparty" | "wolf" | "allstar" | "ultimate" | "cabala" | "morphe" | "soybean" | "pretense" | "perjury" | "xebec" | "crazy" | "ciel" | "dais")[];
        monthry: string[];
        upd_range: string[];
        upd_at: string[];
        sow_auth_id: string[];
        mark: ("love" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "cat" | "music" | "appare")[];
        size: string[];
        say_limit: ("lobby" | "say5" | "wbbs" | "euro" | "weak" | "juna" | "infinity" | "sow" | "say1" | "say5x200" | "say5x300" | "saving" | "tiny" | "vulcan" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid")[];
        game: ("TABULA" | "MILLERHOLLOW" | "LIVE_TABULA" | "LIVE_MILLERHOLLOW" | "TROUBLE" | "MISTERY" | "VOV" | "SECRET" | "GAMEMASTER")[];
        option: ("entrust" | "select-role" | "random-target" | "seq-event" | "show-id" | "undead-talk" | "aiming-talk")[];
        trap: ("blank" | "nothing" | "aprilfool" | "turnfink" | "turnfairy" | "eclipse" | "cointoss" | "force" | "miracle" | "prophecy" | "clamor" | "fire" | "nightmare" | "ghost" | "escape" | "seance")[];
        discard: ROLE_ID[];
        config: ROLE_ID[];
    }) => void;
};
export declare const story_summary: {
    name?: string;
    qid: (is_old: boolean) => string;
    format: () => {
        list: BookStory[];
        folder: DIC<{
            list: BookStory[];
        }>;
    };
    reduce: (o: {
        list: BookStory[];
        folder: DIC<{
            list: BookStory[];
        }>;
    }, doc: BookStory) => void;
    order: (o: {
        list: BookStory[];
        folder: DIC<{
            list: BookStory[];
        }>;
    }, { sort, group_sort }: {
        sort: typeof import("$lib/map-reduce").sort;
        group_sort: typeof import("$lib/map-reduce").group_sort;
    }) => void;
};
export {};
