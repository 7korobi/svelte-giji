import type { BOOK_POTOF_ID, BOOK_EVENT_ID, BookStory, BOOK_STORY_ID, BookPotof } from '../map-reduce';
export declare type BookStat = {
    story_id: BOOK_STORY_ID;
    story: BookStory;
    potof: BookPotof;
} & ({
    _id: BOOK_EVENT_ID;
} | {
    _id: `${BOOK_POTOF_ID}-act`;
    give: number;
} | {
    _id: `${BOOK_POTOF_ID}-commit`;
    sw: boolean;
});
export declare type BOOK_STAT_IDX = 'give';
export declare type BOOK_STAT_ID = `${BOOK_POTOF_ID}-${BOOK_STAT_IDX}`;
