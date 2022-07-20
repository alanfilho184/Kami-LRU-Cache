"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kami_cache = void 0;
const events_1 = __importDefault(require("events"));
class kami_cache {
    constructor(options = { maxAge: 0, updateAgeOnGet: false, rateOfVerifyAgedKeys: 60000 }) {
        const events = new events_1.default();
        this.map = new Map();
        this.maxAge = options.maxAge || 0;
        this.updateAgeOnGet = options.updateAgeOnGet || false;
        setInterval(() => {
            this.map.forEach(info => {
                try {
                    info = JSON.parse(info);
                }
                catch (err) { }
                if (Date.now() - info.usedAt >= info.maxAge && info.maxAge != 0) {
                    this.map.delete(info.key);
                    events.emit('autoDeleteFromCache', (info.key));
                }
            });
        }, options.rateOfVerifyAgedKeys || 60000);
        this._events = events;
    }
    set(key, value, maxAge) {
        this.map.set(key, JSON.stringify({ key: key, content: value, maxAge: maxAge || this.maxAge, creationTime: Date.now(), usedAt: Date.now() }));
        return true;
    }
    get(key) {
        let toReturn;
        try {
            toReturn = this.map.get(key);
            if (toReturn) {
                toReturn = JSON.parse(toReturn);
                if (this.updateAgeOnGet) {
                    this.map.set(key, JSON.stringify({ key: key, content: toReturn.content, maxAge: toReturn.maxAge || this.maxAge, creationTime: toReturn.creationTime, usedAt: Date.now() }));
                }
                toReturn = toReturn.content;
            }
        }
        catch (err) {
            toReturn = undefined;
        }
        return toReturn;
    }
    delete(key) {
        this.map.delete(key);
        return true;
    }
    has(key) {
        if (this.map.get(key)) {
            return true;
        }
        else {
            return false;
        }
    }
    length() {
        return this.map.size;
    }
}
exports.kami_cache = kami_cache;
