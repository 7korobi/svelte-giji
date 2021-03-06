import type { DIC } from 'svelte-map-reduce-store';
export declare const portals: DIC<{
  (el: HTMLElement): {
    destroy(): void;
  };
}>;
export declare function portal(
  selector?: string
):
  | {
      mount: (
        el: HTMLElement
      ) => {
        destroy: () => void;
      };
      slot?: undefined;
    }
  | {
      slot: (
        el: HTMLElement
      ) => {
        destroy: () => void;
      };
      mount: (
        el: HTMLElement
      ) => {
        destroy: () => void;
      };
    };
