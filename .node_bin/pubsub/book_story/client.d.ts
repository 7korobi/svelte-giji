import type { ROLE_ID } from '../map-reduce';
export declare function default_story_query(): {
    search: string;
    idx: string;
    mode: string;
    hide: any[];
};
export declare function default_stories_query(): {
    search: string;
    order: string;
    folder_id: ("wolf" | "ultimate" | "cabala" | "allstar" | "pretense" | "rp" | "morphe" | "soybean" | "ciel" | "perjury" | "xebec" | "dais" | "crazy" | "lobby" | "offparty" | "test")[];
    monthry: string[];
    upd_range: string[];
    upd_at: string[];
    sow_auth_id: string[];
    mark: ("love" | "cat" | "age_A" | "age_B" | "age_C" | "age_D" | "age_Z" | "age_trial" | "age_education" | "age_reserve" | "crude" | "crime" | "drug" | "drunk" | "fear" | "gamble" | "sexy" | "violence" | "biohazard" | "music" | "appare")[];
    size: string[];
    say_limit: ("tiny" | "weak" | "juna" | "say1" | "say5x200" | "say5x300" | "saving" | "euro" | "wbbs" | "sow" | "vulcan" | "infinity" | "lobby" | "say5" | "weak_braid" | "juna_braid" | "vulcan_braid" | "infinity_braid")[];
    game: ("TABULA" | "LIVE_TABULA" | "MILLERHOLLOW" | "LIVE_MILLERHOLLOW" | "TROUBLE" | "MISTERY" | "SECRET" | "VOV" | "GAMEMASTER")[];
    option: ("entrust" | "select-role" | "random-target" | "seq-event" | "show-id" | "undead-talk" | "aiming-talk")[];
    trap: ("blank" | "nothing" | "aprilfool" | "turnfink" | "turnfairy" | "eclipse" | "cointoss" | "force" | "miracle" | "prophecy" | "clamor" | "fire" | "nightmare" | "ghost" | "escape" | "seance")[];
    discard: ROLE_ID[];
    config: ROLE_ID[];
};
export declare const stories: {
    name?: string;
    qid: (ids: `${string}-${number}`[]) => string;
    index?: (_id: any) => string | number | boolean;
    format: () => import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>;
    reduce: (o: import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>, doc: import("svelte-map-reduce-store").BaseT<any>) => void;
    order: (o: import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }, ...args: any[]) => void;
};
export declare const story_summary: {
    name?: string;
    qid: (is_old: boolean) => string;
    index?: (_id: any) => string | number | boolean;
    format: () => import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>;
    reduce: (o: import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>, doc: import("svelte-map-reduce-store").BaseT<any>) => void;
    order: (o: import("svelte-map-reduce-store").BaseF<import("svelte-map-reduce-store").BaseT<any>>, { sort, group_sort }: {
        sort: typeof import("svelte-map-reduce-store").sort;
        group_sort: typeof import("svelte-map-reduce-store").group_sort;
    }, ...args: any[]) => void;
};
