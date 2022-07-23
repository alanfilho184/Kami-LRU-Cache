import { kami_cache } from '.'

let test_cache = new kami_cache({ updateAgeOnGet: true, maxAge: 60000, rateOfVerifyAgedKeys: 1000 })

describe("Test methods of cache class", () => {

  jest.setTimeout(20000)
  it('Test autoDeleteFromCache event emission', async () => {
    expect(test_cache.set("test", { test: "item" }, 10000)).toBeTruthy()
    expect(await new Promise(async (resolve, reject) => {
      test_cache._events.on('autoDeleteFromCache', (key) => {
        if (key) {
          resolve(key)
        }
        else {
          reject()
        }
      })
    })).toBe('test')
  })

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
    expect(test_cache.set("test", { test: "item" }, 10000)).toBeTruthy()
    expect(test_cache.get("test")).toEqual({ test: "item" })

    await new Promise(r => setTimeout(r, 11000));

    expect(test_cache.get("test")).toBeUndefined()
  })

  it('Test updateAgeOnGet and auto delete after hit maxAge with multiple items', async () => {
    expect(test_cache.set("test", { test: "item" }, 3000)).toBeTruthy()
    expect(test_cache.set("test2", { test: "item2" })).toBeTruthy()

    expect(test_cache.get("test")).toEqual({ test: "item" })
    expect(test_cache.get("test")).toEqual({ test: "item" })
    expect(test_cache.get("test")).toEqual({ test: "item" })

    await new Promise(r => setTimeout(r, 10000));

    expect(test_cache.get("test")).toBeUndefined()
    expect(test_cache.get("test2")).toEqual({ test: "item2" })
  })
})
