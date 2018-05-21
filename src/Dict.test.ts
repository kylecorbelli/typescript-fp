import { toUpper } from 'ramda'
import { Dict, HashMap } from './Dict'
import { Just, Nothing } from './Maybe'

describe('Dict', () => {
  const hashMap: HashMap<number> = {
    one: 1,
    two: 2,
  }

  const mrPB: string = 'ooooh weee!'

  describe('empty', () => {
    it('creates a new empty Dict', () => {
      const dict: Dict<number> = Dict.empty()
      expect(dict).toBeInstanceOf(Dict)
    })
  })

  describe('singleton', () => {
    it('creates a new Dict with a single key/value pair', () => {
      const key: string = 'typescript-is-awesome'
      const dict: Dict<boolean> = Dict.singleton(key, true)
      expect(dict).toBeInstanceOf(Dict)
      const result: Just<boolean> = Dict.get(key, dict) as Just<boolean>
      expect(result.value).toBe(true)
    })
  })

  describe('fromHashMap', () => {
    it('creates a new Dict given an ordinary POJO HashMap', () => {
      const dict = Dict.fromHashMap(hashMap)
      expect(dict).toBeInstanceOf(Dict)
    })
  })

  describe('get', () => {
    const dict = Dict.fromHashMap(hashMap)
    const goodKey: string = 'one'
    const badKey: string = 'not-a-currently-valid-key'

    describe('when the key/val pair exists in the Dict for the provided key', () => {
      it('retuns a Just-wrapped value associated with the provided key', () => {
        const result: Just<number> = Dict.get(goodKey, dict) as Just<number>
        expect(result.value).toBe(hashMap[goodKey])
      })
    })

    describe('when the key/val pair does NOT exist in the Dict for the provided key', () => {
      it('returns a Nothing', () => {
        const result: Nothing = Dict.get(badKey)(dict) as Nothing
        expect(result).not.toHaveProperty('value')
      })
    })
  })

  describe('insert', () => {
    const key: string = 'foo'

    describe('when there is a collision on the provided key', () => {
      it('overwrites the existing key/val pair Dict', () => {
        const dict: Dict<number> = Dict.singleton(key, 7)
        const updatedDict = Dict.insert(key, 3, dict)
        const result = Dict.get(key, updatedDict) as Just<number>
        expect(result.value).toBe(3)
      })
    })

    describe('when there is no collision on the provided key', () => {
      it('adds a new key/val pair to the Dict', () => {
        const dict: Dict<number> = Dict.empty()
        const updatedDict = Dict.insert(key, 3, dict)
        const result = Dict.get(key, updatedDict) as Just<number>
        expect(result.value).toBe(3)
      })
    })
  })

  describe('member', () => {
    const key: string = 'noob-noob'

    describe('when the Dict has a key/val pair corresponding to the provided key', () => {
      it('returns true', () => {
        const dict = Dict.singleton(key, 'gd!')
        const result: boolean = Dict.member(key, dict)
        expect(result).toBe(true)
      })
    })

    describe('when the Dict does NOT have a key/val pair corresponding to the provided key', () => {
      it('returns false', () => {
        const dict: Dict<string> = Dict.empty()
        const result: boolean = Dict.member(key)(dict)
        expect(result).toBe(false)
      })
    })
  })

  // for all of these, should we test immutability?

  describe('update', () => {
    const val: string = 'some lowercase'

    describe('when the provided key exists in the provided Dict', () => {
      it('applies the provided function to the value associated with the provided key', () => {
        const dict: Dict<string> = Dict.singleton(mrPB, val)
        const updatedDict = Dict.update(mrPB, toUpper, dict)
        const result = Dict.get(mrPB, updatedDict) as Just<string>
        expect(result.value).toBe(toUpper(val))
      })
    })

    describe('when the provided key does NOT exist in the provided Dict', () => {
      it('leaves the Dict unaltered', () => {
        const dict: Dict<string> = Dict.empty()
        const updatedDict = Dict.update(mrPB, toUpper)(dict)
        expect(updatedDict).toEqual(dict)
      })
    })
  })

  describe('remove', () => {
    describe('when the provided key exists in the provided Dict', () => {
      it('removes the key/val pair from the provided Dict', () => {
        const dict = Dict.singleton(mrPB, 'foo') as Dict<string>
        const sanityCheck = Dict.get(mrPB, dict) as Just<string>
        expect(sanityCheck).toHaveProperty('value')

        const updatedDict = Dict.remove(mrPB)(dict)
        const result = Dict.get(mrPB, updatedDict)
        expect(result).not.toHaveProperty('value')
      })
    })

    describe('when the provided key does NOT exist in the provided Dict', () => {
      it('leaves the Dict unaltered', () => {
        const dict = Dict.empty()
        const updatedDict = Dict.remove(mrPB, dict)
        expect(updatedDict).toEqual(dict)
      })
    })
  })

  describe('isEmpty', () => {
    it('determines whether or not the Dict is empty', () => {
      const emptyDict: Dict<number> = Dict.empty()
      expect(Dict.isEmpty(emptyDict)).toBe(true)

      const dict: Dict<number> = Dict.singleton('somethig', 7)
      expect(Dict.isEmpty(dict)).toBe(false)
    })
  })

  describe('size', () => {
    it('determines the number of key/val pairs in the provided Dict', () => {
      const dict = Dict.fromHashMap(hashMap)
      expect(Dict.size(dict)).toBe(Object.keys(hashMap).length)
    })
  })

  describe('keys', () => {
    it('returns a list of strings corresponding to the keys in the Dict', () => {
      const dict: Dict<number> = Dict.fromHashMap(hashMap)
      expect(Dict.keys(dict)).toEqual(Object.keys(hashMap))
    })
  })

  describe('values', () => {
    it('returns a list of the values in the Dict', () => {
      const dict: Dict<number> = Dict.fromHashMap(hashMap)
      expect(Dict.values(dict)).toEqual(Object.values(hashMap))
    })
  })

  describe('toHashMap', () => {
    it('returns a POJO hashmap representation of the provided Dict’s internal store', () => {
      const dict = Dict.fromHashMap(hashMap)
      expect(Dict.toHashMap(dict)).toEqual(hashMap)
    })
  })

  describe('map', () => {
    it('applies a function to all values in a Dict', () => {
      const doubleAndExplain = (key: string, val: number): string => `The value for key ${key} is now ${val * 2}`
      const dict = Dict.fromHashMap(hashMap)
      const updatedDict = Dict.map(doubleAndExplain, dict)
      const expectedNewValues = Object.keys(hashMap).map((key: string) => doubleAndExplain(key, hashMap[key]))
      expect(Dict.values(updatedDict)).toEqual(expectedNewValues)
    })
  })

  describe('filter', () => {
    it('leaves only the key/val pairs that satisfy the provided predicate', () => {
      const dict = Dict.fromHashMap(hashMap)
      const isEven = (_key: string, val: number): boolean => val % 2 === 0
      const newDict = Dict.filter(isEven, dict)
      const { one, ...rest } = hashMap
      expect(Dict.toHashMap(newDict)).toEqual(rest)
    })
  })

  describe('reduce', () => {
    it('folds over the key/val pairs in the Dict', () => {
      const dict = Dict.fromHashMap(hashMap)
      const summer = (_key: string, val: number, accum: number): number => val + accum
      const result: number = Dict.reduce(summer, 10, dict)
      expect(result).toBe(13)
    })
  })

  describe('union', () => {
    it('combines two dictionaries, giving preference to the FIRST dictionary in the case of a collision', () => {
      const dict = Dict.fromHashMap(hashMap)
      const anotherHashMap: HashMap<number> = {
        three: 3,
        two: 2000000,
      }
      const anotherDict = Dict.fromHashMap(anotherHashMap)
      const newDict = Dict.union(dict, anotherDict)
      expect(Dict.toHashMap(newDict)).toEqual({ ...anotherHashMap, ...hashMap })
    })
  })
})
