import type { BOOK_POTOF_ID, ROLE_ID, Role, BookStory, BOOK_STORY_ID } from '../map-reduce';
export declare type BookCard = {
    role_id: ROLE_ID;
    story_id: BOOK_STORY_ID;
    story: BookStory;
    role?: Role;
} & ({
    _id: `${BOOK_POTOF_ID}-${'role' | 'gift'}`;
} | {
    _id: `${BOOK_POTOF_ID}-request`;
} | {
    _id: `${BOOK_POTOF_ID}-live`;
    date: number;
});
export declare type BOOK_CARD_IDX = 'live' | 'role' | 'gift' | 'request';
export declare type BOOK_CARD_ID = `${BOOK_POTOF_ID}-${BOOK_CARD_IDX}`;
