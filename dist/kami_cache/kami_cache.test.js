"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kami_cache_1 = require("./kami_cache");
describe("Test methods of cache class", () => {
    const test_cache = new kami_cache_1.kami_cache({ updateAgeOnGet: true, maxAge: 60000, rateOfVerifyAgedKeys: 1000 });
    jest.setTimeout(20000);
    it('Test autoDeleteFromCache event emission', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(test_cache.set("test", { test: "item" }, 10000)).toBeTruthy();
        expect(yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            test_cache._events.on('autoDeleteFromCache', (key) => {
                if (key) {
                    resolve(key);
                }
                else {
                    reject();
                }
            });
        }))).toBe('test');
    }));
    it('Test set on cache', () => {
        expect(test_cache.set("test", { test: "item" })).toBeTruthy();
    });
    it('Test get on cache', () => {
        expect(test_cache.get("test")).toEqual({ test: "item" });
    });
    it('Test has on cache', () => {
        expect(test_cache.has("test")).toBeTruthy();
    });
    it('Test get lenght on cache', () => {
        expect(test_cache.length()).toEqual(1);
    });
    it('Test delete on cache', () => {
        expect(test_cache.delete("test")).toBeTruthy();
    });
    it('Test get lenght on cache after delete', () => {
        expect(test_cache.length()).toEqual(0);
    });
    jest.setTimeout(15000);
    it('Test auto delete after hit maxAge', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(test_cache.set("test", { test: "item" }, 10000)).toBeTruthy();
        expect(test_cache.get("test")).toEqual({ test: "item" });
        yield new Promise(r => setTimeout(r, 11000));
        expect(test_cache.get("test")).toBeUndefined();
    }));
    it('Test updateAgeOnGet and auto delete after hit maxAge with multiple items', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(test_cache.set("test", { test: "item" }, 3000)).toBeTruthy();
        expect(test_cache.set("test2", { test: "item2" })).toBeTruthy();
        expect(test_cache.get("test")).toEqual({ test: "item" });
        expect(test_cache.get("test")).toEqual({ test: "item" });
        expect(test_cache.get("test")).toEqual({ test: "item" });
        yield new Promise(r => setTimeout(r, 10000));
        expect(test_cache.get("test")).toBeUndefined();
        expect(test_cache.get("test2")).toEqual({ test: "item2" });
    }));
});
