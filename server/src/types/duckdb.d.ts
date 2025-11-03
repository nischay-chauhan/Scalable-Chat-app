import { EventEmitter } from 'events';

declare module 'duckdb' {
  export interface Database extends EventEmitter {
    all(sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void): void;
    get(sql: string, params: any[], callback: (err: Error | null, row: any) => void): void;
    run(sql: string, params: any[], callback?: (err: Error | null) => void): void;
    serialize(callback: () => void): void;
  }

  export function Database(path: string, options?: any): Database;
}
