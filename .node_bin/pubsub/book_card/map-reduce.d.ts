import type { DIC } from '$lib/map-reduce';
import type { BOOK_POTOF_ID, ROLE_ID, Role, BookStory, BOOK_STORY_ID, BookPotof, Able } from '../map-reduce';
declare type BookCardBase = {
    role_id: ROLE_ID;
    story_id: BOOK_STORY_ID;
    story: BookStory;
    potof: BookPotof;
    role?: Role;
    ables?: Able[];
    act: DIC<{
        target?: BOOK_POTOF_ID;
        done?: boolean;
        unit?: 'count' | 'all';
        remain?: number;
    }>;
};
export declare type BookCardRole = {
    _id: `${BOOK_POTOF_ID}-${'role' | 'gift'}`;
} & BookCardBase;
export declare type BookCardSelect = {
    _id: `${BOOK_POTOF_ID}-select`;
} & BookCardBase;
export declare type BookCardLive = {
    _id: `${BOOK_POTOF_ID}-live`;
    date: number;
} & BookCardBase;
export declare type BookCard = BookCardRole | BookCardSelect | BookCardLive;
export declare type BOOK_CARD_IDX = 'live' | 'role' | 'gift' | 'request';
export declare type BOOK_CARD_ID = `${BOOK_POTOF_ID}-${BOOK_CARD_IDX}`;
export {};
