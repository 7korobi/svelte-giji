import type { RANDOM_TYPE } from '../map-reduce';
export declare const randoms:
  | {
      $match(types: RANDOM_TYPE[]): RANDOM_TYPE[];
      query(
        $match: RANDOM_TYPE[]
      ): Promise<
        {
          _id: string | number;
          types: RANDOM_TYPE[];
          order: number;
          ratio: number;
          label: string;
          name?: string;
          hebrew?: string;
          symbol?: string;
          choice: string;
          year?: number;
          number?: number;
          rank?: '' | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
          suite?: '' | '♢' | '♡' | '♣' | '♠';
          roman?:
            | 'II'
            | 'I'
            | 'V'
            | 'X'
            | 'VI'
            | 'XI'
            | 'III'
            | 'IV'
            | 'VII'
            | 'VIII'
            | 'IX'
            | 'XII'
            | 'XIII'
            | 'XIV'
            | 'XV'
            | 'XVI'
            | 'XVII'
            | 'XVIII'
            | 'XIX'
            | 'XX'
            | 'XXI';
        }[]
      >;
    }
  | {
      $match(types: RANDOM_TYPE[]): RANDOM_TYPE[];
      query(
        $match: RANDOM_TYPE[]
      ): Promise<
        {
          _id: string | number;
          types: RANDOM_TYPE[];
          order: number;
          ratio: number;
          label: string;
          name?: string;
          hebrew?: string;
          symbol?: string;
          choice: string;
          year?: number;
          number?: number;
          rank?: '' | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
          suite?: '' | '♢' | '♡' | '♣' | '♠';
          roman?:
            | 'II'
            | 'I'
            | 'V'
            | 'X'
            | 'VI'
            | 'XI'
            | 'III'
            | 'IV'
            | 'VII'
            | 'VIII'
            | 'IX'
            | 'XII'
            | 'XIII'
            | 'XIV'
            | 'XV'
            | 'XVI'
            | 'XVII'
            | 'XVIII'
            | 'XIX'
            | 'XX'
            | 'XXI';
        }[]
      >;
      isLive(types: RANDOM_TYPE[]): Promise<boolean>;
      live(
        $match: RANDOM_TYPE[],
        set: (
          docs: {
            _id: string | number;
            types: RANDOM_TYPE[];
            order: number;
            ratio: number;
            label: string;
            name?: string;
            hebrew?: string;
            symbol?: string;
            choice: string;
            year?: number;
            number?: number;
            rank?: '' | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
            suite?: '' | '♢' | '♡' | '♣' | '♠';
            roman?:
              | 'II'
              | 'I'
              | 'V'
              | 'X'
              | 'VI'
              | 'XI'
              | 'III'
              | 'IV'
              | 'VII'
              | 'VIII'
              | 'IX'
              | 'XII'
              | 'XIII'
              | 'XIV'
              | 'XV'
              | 'XVI'
              | 'XVII'
              | 'XVIII'
              | 'XIX'
              | 'XX'
              | 'XXI';
          }[]
        ) => void,
        del: (ids: (string | number)[]) => void
      ): import('mongodb').ChangeStream<{
        _id: string | number;
        types: RANDOM_TYPE[];
        order: number;
        ratio: number;
        label: string;
        name?: string;
        hebrew?: string;
        symbol?: string;
        choice: string;
        year?: number;
        number?: number;
        rank?: '' | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
        suite?: '' | '♢' | '♡' | '♣' | '♠';
        roman?:
          | 'II'
          | 'I'
          | 'V'
          | 'X'
          | 'VI'
          | 'XI'
          | 'III'
          | 'IV'
          | 'VII'
          | 'VIII'
          | 'IX'
          | 'XII'
          | 'XIII'
          | 'XIV'
          | 'XV'
          | 'XVI'
          | 'XVII'
          | 'XVIII'
          | 'XIX'
          | 'XX'
          | 'XXI';
      }>;
      set(doc: {
        _id: string | number;
        types: RANDOM_TYPE[];
        order: number;
        ratio: number;
        label: string;
        name?: string;
        hebrew?: string;
        symbol?: string;
        choice: string;
        year?: number;
        number?: number;
        rank?: '' | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
        suite?: '' | '♢' | '♡' | '♣' | '♠';
        roman?:
          | 'II'
          | 'I'
          | 'V'
          | 'X'
          | 'VI'
          | 'XI'
          | 'III'
          | 'IV'
          | 'VII'
          | 'VIII'
          | 'IX'
          | 'XII'
          | 'XIII'
          | 'XIV'
          | 'XV'
          | 'XVI'
          | 'XVII'
          | 'XVIII'
          | 'XIX'
          | 'XX'
          | 'XXI';
      }): Promise<
        import('mongodb').ModifyResult<{
          _id: string | number;
          types: RANDOM_TYPE[];
          order: number;
          ratio: number;
          label: string;
          name?: string;
          hebrew?: string;
          symbol?: string;
          choice: string;
          year?: number;
          number?: number;
          rank?: '' | 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
          suite?: '' | '♢' | '♡' | '♣' | '♠';
          roman?:
            | 'II'
            | 'I'
            | 'V'
            | 'X'
            | 'VI'
            | 'XI'
            | 'III'
            | 'IV'
            | 'VII'
            | 'VIII'
            | 'IX'
            | 'XII'
            | 'XIII'
            | 'XIV'
            | 'XV'
            | 'XVI'
            | 'XVII'
            | 'XVIII'
            | 'XIX'
            | 'XX'
            | 'XXI';
        }>
      >;
      del(ids: (string | number)[]): Promise<import('mongodb').DeleteResult>;
    };
