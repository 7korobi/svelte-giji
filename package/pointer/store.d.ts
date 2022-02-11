declare type Marker = ' ' | '<' | '>' | 'o' | 'x';
declare type Border = ' ' | '.' | '-' | '=';
export declare type Line = {
  v: string;
  w: string;
  line: `${Marker}${Border}${Marker}`;
  vpos: number;
  wpos: number;
  label: string;
};
export declare type Icon = {
  v: string;
  label: string;
  roll: number;
  x: number;
  y: number;
};
export declare type Cluster = {
  label: string;
  vs: string[];
};
export declare const style: import('svelte/store').Writable<{
  icon: {
    width: number;
    height: number;
  };
  gap_size: number;
  line_slide: number;
  border_width: number;
  rx: number;
  ry: number;
}>;
export declare const url: import('svelte/store').Writable<{
  portrate: string;
}>;
export {};
