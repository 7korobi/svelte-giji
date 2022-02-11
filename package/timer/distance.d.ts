import { Tempo } from './tempo';
export declare const INTERVAL_MAX = 2147483647;
export declare function to_timer(msec: number, unit_mode?: 0 | 1): string;
export declare function tickDistance(
  at: number | string | Date | undefined,
  {
    limit,
    format
  }?: {
    limit: string;
    format(at: Date): string;
  }
): import('svelte/store').Readable<Tempo>;
