import type { presentation } from '../_type/string';
import type { BOOK_STORY_IDX, BOOK_STORY_ID, BookStory } from '../map-reduce';
export declare type BookEvent = {
    _id: BOOK_EVENT_ID;
    story_id: BOOK_STORY_ID;
    story: BookStory;
    winner: WIN;
    write_at: Date;
    created_at?: Date;
    updated_at?: Date;
    turn: number;
    event?: null;
    epilogue?: 0 | -1;
    grudge?: 0 | -1;
    riot?: 0 | -1;
    scapegoat?: 0 | -1;
    eclipse?: BOOK_EVENT_IDX[];
    seance?: BOOK_EVENT_IDX[];
    say?: {
        modifiedsay: Date;
        modifiedwsay?: Date;
        modifiedgsay?: Date;
        modifiedspsay?: Date;
        modifiedxsay?: Date;
        modifiedvsay?: Date;
    };
    name?: presentation;
};
export declare type BOOK_EVENT_IDX = `${number}` | 'top';
export declare type BOOK_EVENT_ID = `${string}-${BOOK_STORY_IDX}-${BOOK_EVENT_IDX}`;
export declare type WIN = typeof WINS[number];
export declare const WINS: readonly ["NONE", "HUMAN", "EVIL", "WOLF", "PIXI", "HATER", "LOVER", "LONEWOLF", "GURU", "DISH", "MOB"];
