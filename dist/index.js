"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kami_cache = void 0;
const events_1 = require("events");
class kami_events extends events_1.EventEmitter {
    emitKeyAutoDelete(key) {
        this.emit('keyAutoDelete', key);
    }
    emitKeySet(key) {
        this.emit('keySet', key);
    }
    emitKeyUpdateAge(key, newAge) {
        this.emit('keyUpdateAge', key, newAge);
    }
    emitKeyGet(key) {
        this.emit('keyGet', key);
    }
    emitKeyDelete(key) {
        this.emit('keyDelete', key);
    }
    emitKeyHas(key, has) {
        this.emit('keyHas', key, has);
    }
    emitCacheLength(cacheLength) {
        this.emit('cacheLength', cacheLength);
    }
    emitCacheClear() {
        this.emit('cacheClear');
    }
}
class kami_cache {
    constructor(options = { maxAge: 0, updateAgeOnGet: false, rateOfVerifyAgedKeys: 60000 }) {
        this.map = new Map();
        this.maxAge = options.maxAge || 0;
        this.updateAgeOnGet = options.updateAgeOnGet || false;
        this.events = new kami_events();
        setInterval(() => {
            this.map.forEach(info => {
                try {
                    info = JSON.parse(info);
                }
                catch (err) { }
                if (Date.now() - info.usedAt >= info.maxAge && info.maxAge != 0) {
                    this.map.delete(info.key);
                    this.events.emitKeyAutoDelete(info.key);
                }
            });
        }, options.rateOfVerifyAgedKeys || 60000);
    }
    set(key, value, maxAge) {
        this.map.set(key, JSON.stringify({ key: key, content: value, maxAge: maxAge || this.maxAge, creationTime: Date.now(), usedAt: Date.now() }));
        this.events.emitKeySet(key);
        return true;
    }
    get(key) {
        let toReturn;
        try {
            toReturn = this.map.get(key);
            if (toReturn) {
                toReturn = JSON.parse(toReturn);
                if (this.updateAgeOnGet) {
                    const usedAt = Date.now();
                    const maxAgeOfKey = toReturn.maxAge || this.maxAge;
                    const newAge = usedAt + maxAgeOfKey;
                    this.map.set(key, JSON.stringify({ key: key, content: toReturn.content, maxAge: maxAgeOfKey, creationTime: toReturn.creationTime, usedAt: usedAt }));
                    this.events.emitKeyUpdateAge(key, newAge);
                }
                toReturn = toReturn.content;
            }
        }
        catch (err) {
            toReturn = undefined;
        }
        this.events.emitKeyGet(key);
        return toReturn;
    }
    delete(key) {
        this.map.delete(key);
        this.events.emitKeyDelete(key);
        return true;
    }
    has(key) {
        if (this.map.get(key)) {
            this.events.emitKeyHas(key, true);
            return true;
        }
        else {
            this.events.emitKeyHas(key, false);
            return false;
        }
    }
    length() {
        this.events.emitCacheLength(this.map.size);
        return this.map.size;
    }
    clear() {
        this.map.clear();
        this.events.emitCacheClear();
        return true;
    }
}
exports.kami_cache = kami_cache;
