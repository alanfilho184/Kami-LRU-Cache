import { EventEmitter } from "events"

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

class kami_events extends EventEmitter {
  emitKeyAutoDelete(key: string): void {
    this.emit('keyAutoDelete', key)
  }

  emitKeySet(key: string): void {
    this.emit('keySet', key)
  }

  emitKeyUpdateAge(key: string, newAge: number): void {
    this.emit('keyUpdateAge', key, newAge)
  }

  emitKeyGet(key: string): void {
    this.emit('keyGet', key)
  }

  emitKeyDelete(key: string): void {
    this.emit('keyDelete', key)
  }

  emitKeyHas(key: string, has: boolean): void {
    this.emit('keyHas', key, has)
  }

  emitCacheLength(cacheLength: number): void {
    this.emit('cacheLength', cacheLength)
  }

  emitCacheClear(): void {
    this.emit('cacheClear')
  }
}

export class kami_cache {
  map: Map<string, any>
  readonly maxAge: number
  readonly updateAgeOnGet: boolean
  readonly events: kami_events

  constructor(options: { maxAge?: number, updateAgeOnGet?: boolean, rateOfVerifyAgedKeys?: number } = { maxAge: 0, updateAgeOnGet: false, rateOfVerifyAgedKeys: 60000 }) {
    this.map = new Map()
    this.maxAge = options.maxAge || 0
    this.updateAgeOnGet = options.updateAgeOnGet || false
    this.events = new kami_events()

    setInterval(() => {
      this.map.forEach(info => {
        try {
          info = JSON.parse(info)
        } catch (err) { }
        if (Date.now() - info.usedAt >= info.maxAge && info.maxAge != 0) {
          this.map.delete(info.key)
          this.events.emitKeyAutoDelete(info.key)
        }
      })
    }, options.rateOfVerifyAgedKeys || 60000)

  }

  set(key: string, value: any, maxAge?: number,) {
    this.map.set(key, JSON.stringify({ key: key, content: value, maxAge: maxAge || this.maxAge, creationTime: Date.now(), usedAt: Date.now() }))
    this.events.emitKeySet(key)

    return true
  }

  get(key: string) {
    let toReturn

    try {
      toReturn = this.map.get(key)
      if (toReturn) {
        toReturn = JSON.parse(toReturn)

        if (this.updateAgeOnGet) {
          const usedAt = Date.now()
          const maxAgeOfKey = toReturn.maxAge || this.maxAge
          const newAge = usedAt + maxAgeOfKey

          this.map.set(key, JSON.stringify({ key: key, content: toReturn.content, maxAge: maxAgeOfKey, creationTime: toReturn.creationTime, usedAt: usedAt }))
          this.events.emitKeyUpdateAge(key, newAge)
        }

        toReturn = toReturn.content
      }
    }
    catch (err) {
      toReturn = undefined
    }
    this.events.emitKeyGet(key)

    return toReturn
  }

  delete(key: string) {
    this.map.delete(key)
    this.events.emitKeyDelete(key)

    return true
  }

  has(key: string) {
    if (this.map.get(key)) {
      this.events.emitKeyHas(key, true)

      return true
    }
    else {
      this.events.emitKeyHas(key, false)

      return false
    }
  }

  length() {
    this.events.emitCacheLength(this.map.size)

    return this.map.size
  }

  clear() {
    this.map.clear()

    this.events.emitCacheClear()

    return true
  }
}