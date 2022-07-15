export class kami_cache {
  map: Map<string, any>
  maxAge: number
  updateAgeOnGet: boolean

  

  constructor(options: { maxAge?: number, updateAgeOnGet?: boolean, rateOfVerifyAgedKeys?: number } = { maxAge: 0, updateAgeOnGet: false, rateOfVerifyAgedKeys: 60000 }) {
    this.map = new Map()
    this.maxAge = options.maxAge || 0
    this.updateAgeOnGet = options.updateAgeOnGet || false

    setInterval(() => {
      this.map.forEach(info => {
        try {
          info = JSON.parse(info)
        } catch (err) { }
        if (Date.now() - info.usedAt >= info.maxAge && info.maxAge != 0) {
          this.map.delete(info.key)
        }
      })
    }, options.rateOfVerifyAgedKeys || 60000)
  }

  set(key: string, value: any, maxAge?: number,) {
    this.map.set(key, JSON.stringify({ key: key, content: value, maxAge: maxAge || this.maxAge, creationTime: Date.now(), usedAt: Date.now() }))

    return true
  }

  get(key: string) {
    let toReturn

    try {
      toReturn = this.map.get(key)
      if (toReturn) {
        toReturn = JSON.parse(toReturn)

        if (this.updateAgeOnGet) {
          this.map.set(key, JSON.stringify({ key: key, content: toReturn.content, maxAge: toReturn.maxAge || this.maxAge, creationTime: toReturn.creationTime, usedAt: Date.now() }))
        }

        toReturn = toReturn.content
      }
    }
    catch (err) {
      toReturn = undefined
    }

    return toReturn
  }

  delete(key: string) {
    this.map.delete(key)

    return true
  }

  has(key: string) {
    if (this.map.get(key)) {
      return true
    }
    else {
      return false
    }
  }

  length() {
    return this.map.size
  }
}