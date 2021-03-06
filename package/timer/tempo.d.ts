export declare class Tempo {
  label?: string;
  table?: number[];
  zero: number;
  write_at: number;
  now_idx: number;
  last_at: number;
  next_at: number;
  get size(): number;
  get since(): number;
  get remain(): number;
  get timeout(): number;
  get center_at(): number;
  get moderate_at(): number;
  get deg(): string;
  is_cover(at: number): boolean;
  is_hit(that: Tempo): boolean;
  succ(n?: number): Tempo;
  back(n?: number): Tempo;
  slide_to(n: number): Tempo;
  round(sub1: number, sub2: number, subf?: typeof to_tempo_bare): Tempo;
  ceil(sub1: number, sub2: number, subf?: typeof to_tempo_bare): Tempo;
  floor(sub1: number, sub2: number, subf?: typeof to_tempo_bare): Tempo;
  to_list(step: Tempo): Tempo[];
  upto(limit: Tempo): Tempo[];
  slide(n: number): Tempo;
  copy(): Tempo;
  reset(now?: number): Tempo;
  tick(): Tempo;
  sleep(): Promise<unknown>;
  constructor(zero: number, now_idx: number, write_at: number, last_at: number, next_at: number, table?: number[]);
  static join(a: Tempo, b: Tempo): Tempo;
  static sleep(tempos: Tempo[]): Promise<unknown>;
}
export declare function to_tempo_bare(size: number, zero: number, write_at_src: number | Date): Tempo;
export declare function to_tempo(size_str: string, zero_str?: string, write_at?: number | Date): Tempo;
export declare function to_tempo_by(table: number[], zero: number, write_at: number): Tempo;
export declare function tickTempo(size_str: string, zero_str?: string): import('svelte/store').Readable<Tempo>;
export declare function tickTempoBare(size: number, zero: number): import('svelte/store').Readable<Tempo>;
export declare function tickTempoBy(
  fns: [(now: number) => number, (now: number) => number],
  zero_str?: string
): import('svelte/store').Readable<Tempo>;
