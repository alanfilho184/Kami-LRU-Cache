/// <reference types="node" />
import { EventEmitter } from "events";
declare interface kami_events {
    on(event: 'keyAutoDelete', listener: (key: string) => void): this;
    on(event: 'keySet', listener: (key: string) => void): this;
    on(event: 'keyUpdateAge', listener: (key: string, newAge: Number) => void): this;
    on(event: 'keyGet', listener: (key: string) => void): this;
    on(event: 'keyDelete', listener: (key: string) => void): this;
    on(event: 'keyHas', listener: (key: string, has: boolean) => void): this;
    on(event: 'cacheLength', listener: (lenght: number) => void): this;
    on(event: 'cacheClear', listener: () => void): this;
    on(event: string, listener: Function): this;
}
declare class kami_events extends EventEmitter {
    emitKeyAutoDelete(key: string): void;
    emitKeySet(key: string): void;
    emitKeyUpdateAge(key: string, newAge: number): void;
    emitKeyGet(key: string): void;
    emitKeyDelete(key: string): void;
    emitKeyHas(key: string, has: boolean): void;
    emitCacheLength(cacheLength: number): void;
    emitCacheClear(): void;
}
export declare class kami_cache {
    map: Map<string, any>;
    readonly maxAge: number;
    readonly updateAgeOnGet: boolean;
    readonly events: kami_events;
    constructor(options?: {
        maxAge?: number;
        updateAgeOnGet?: boolean;
        rateOfVerifyAgedKeys?: number;
    });
    set(key: string, value: any, maxAge?: number): boolean;
    get(key: string): any;
    delete(key: string): boolean;
    has(key: string): boolean;
    length(): number;
    clear(): boolean;
}
export {};
