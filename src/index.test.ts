import { kami_cache } from '.'

let test_cache = new kami_cache({ updateAgeOnGet: true, maxAge: 60000, rateOfVerifyAgedKeys: 500 })

describe("Test methods of cache class", () => {
  it('Test set on cache', () => {
    expect(test_cache.set("test", { test: "item" })).toBeTruthy()
  })

  it('Test get on cache', () => {
    expect(test_cache.get("test")).toEqual({ test: "item" })
  })

  it('Test has on cache', () => {
    expect(test_cache.has("test")).toBeTruthy()
  })

  it('Test get lenght on cache', () => {
    expect(test_cache.length()).toEqual(1)
  })

  it('Test delete on cache', () => {
    expect(test_cache.delete("test")).toBeTruthy()
  })

  it('Test get lenght on cache after delete', () => {
    expect(test_cache.length()).toEqual(0)
  })

  jest.setTimeout(15000)
  it('Test auto delete after hit maxAge', async () => {
    expect(test_cache.set("test", { test: "item" }, 3000)).toBeTruthy()
    expect(test_cache.get("test")).toEqual({ test: "item" })

    await new Promise(r => setTimeout(r, 5000));

    expect(test_cache.get("test")).toBeUndefined()
  })

  it('Test updateAgeOnGet and auto delete after hit maxAge with multiple items', async () => {
    expect(test_cache.set("test", { test: "item" }, 3000)).toBeTruthy()
    expect(test_cache.set("test2", { test: "item2" })).toBeTruthy()

    expect(test_cache.get("test")).toEqual({ test: "item" })
    expect(test_cache.get("test")).toEqual({ test: "item" })
    expect(test_cache.get("test")).toEqual({ test: "item" })

    await new Promise(r => setTimeout(r, 5000));

    expect(test_cache.get("test")).toBeUndefined()
    expect(test_cache.get("test2")).toEqual({ test: "item2" })
  })

  it('Test clear all itens on cache', () => {
    expect(test_cache.set("test", "test")).toBeTruthy()
    expect(test_cache.length()).toBeGreaterThanOrEqual(1)
    expect(test_cache.clear()).toBeTruthy()
    expect(test_cache.length()).toEqual(0)
  })
})

describe("Test events of cache class", () => {
  jest.setTimeout(5000)
  it('Test keyAutoDelete event emission', async () => {
    expect(test_cache.set("test", { test: "item" }, 3000)).toBeTruthy()
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('keyAutoDelete', (key) => {
        if (key) {
          resolve(key)
        }
        else {
          reject()
        }
      })
    })).toBe('test')
  })

  it('Test keySet event emission', async () => {
    setTimeout(() => expect(test_cache.set("test", { test: "item" })).toBeTruthy(), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('keySet', (key) => {
        if (key) {
          resolve(key)
        }
        else {
          reject()
        }
      })
    })).toBe('test')
  })

  jest.setTimeout(10000)
  it('Test keyUpdateAge event emission', async () => {
    test_cache.set("test", { test: "item" })
    setTimeout(() => expect(test_cache.get("test")).toEqual({ test: "item" }), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('keyUpdateAge', (key, newAge) => {
        if (key === "test" && newAge > Date.now()) {
          resolve(true)
        }
        else {
          reject()
        }
      })
    })).toBeTruthy()
  })

  it('Test keyGet event emission', async () => {
    setTimeout(() => expect(test_cache.get("test")).toEqual({ test: "item" }), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('keyGet', (key) => {
        if (key) {
          resolve(key)
        }
        else {
          reject()
        }
      })
    })).toBe('test')
  })

  it('Test keyHas event emission', async () => {
    setTimeout(() => expect(test_cache.has("test")).toBeTruthy(), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('keyHas', (key, has) => {
        if (key) {
          resolve({ key: key, has: has })
        }
        else {
          reject()
        }
      })
    })).toEqual({ key: "test", has: true })
  })

  it('Test cacheLength event emission', async () => {
    setTimeout(() => expect(test_cache.length()).toEqual(1), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('cacheLength', (length) => {
        if (length) {
          resolve(length)
        }
        else {
          reject()
        }
      })
    })).toEqual(1)
  })

  it('Test keyDelete event emission', async () => {
    setTimeout(() => expect(test_cache.delete('test')).toBeTruthy(), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('keyDelete', (key) => {
        if (key) {
          resolve(key)
        }
        else {
          reject()
        }
      })
    })).toBe('test')
  })

  it('Test cacheClear event emission', async () => {
    setTimeout(() => expect(test_cache.clear()).toBeTruthy(), 2000)
    expect(await new Promise(async (resolve, reject) => {
      test_cache.events.on('cacheClear', () => {
        resolve(true)
      })
    })).toBeTruthy()
  })
})
