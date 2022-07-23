/// <reference types="node" />
import EventEmitter from "events";
export declare class kami_cache {
    map: Map<string, any>;
    maxAge: number;
    updateAgeOnGet: boolean;
    _events: EventEmitter;
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
}
