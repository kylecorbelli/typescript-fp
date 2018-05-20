import {
  compose,
  curry,
  toUpper,
} from 'ramda'
import {
  Just,
  Maybe,
  MaybeType,
  Nothing,
} from './Maybe'

describe('the Maybe module', () => {
  const name: string = 'noob noob'

  describe('Maybe.fromNullable', () => {
    describe('when given a null', () => {
      it('returns a Nothing', () => {
        const result = Maybe.fromNullable(null)
        expect(result.type).toBe(MaybeType.Nothing)
      })
    })

    describe('when given an undefined', () => {
      it('returns a Nothing', () => {
        const result = Maybe.fromNullable(undefined)
        expect(result.type).toBe(MaybeType.Nothing)
      })
    })

    describe('when given a concrete value', () => {
      it('returns a Just', () => {
        const result: Just<string> = Maybe.fromNullable(name) as Just<string>
        expect(result.type).toBe(MaybeType.Just)
        expect(result.value).toBe(name)
      })
    })
  })

  describe('Maybe.map', () => {
    describe('when given a Nothing', () => {
      it('returns a Nothing', () => {
        const result = Maybe.map(toUpper, Nothing())
        expect(result).toEqual(Nothing())
      })
    })

    describe('when given a Just', () => {
      it('applies the provided function to the Just value', () => {
        const result = Maybe.map(toUpper)(Just(name))
        expect(result).toEqual(Just(toUpper(name)))
      })
    })
  })

  describe('Maybe.andThen', () => {
    const safeDivide = curry((a: number, b: number): Maybe<number> => {
      return a === 0
        ? Nothing()
        : Just(b / a)
    })

    describe('when we encounter a Nothing in a composition chain', () => {
      it('gracefully handles the absence', () => {
        const result = compose(
          Maybe.andThen(safeDivide(3)),
          Maybe.andThen(safeDivide(0)),
          Maybe.andThen(safeDivide(4)),
          safeDivide(2),
        )(32)
        expect(result).toEqual(Nothing())
      })
    })

    describe('when a composition chain works out according to plan', () => {
      it('returns our desired result', () => {
        const result = compose(
          Maybe.andThen(safeDivide(3)),
          Maybe.andThen(safeDivide(5)),
          Maybe.andThen(safeDivide(4)),
          safeDivide(2),
        )(32)
        expect(result).toEqual(Just(32 / 2 / 4 / 5 / 3))
      })
    })
  })

  describe('Maybe.withDefault', () => {
    describe('when given a default value and a Nothing', () => {
      it('returns the default value', () => {
        const result = Maybe.withDefault(name, Nothing())
        expect(result).toBe(name)
      })
    })

    describe('when given a default value and a Just', () => {
      it('returns the Just value', () => {
        const result = Maybe.withDefault('foo')(Just(name))
        expect(result).toBe(name)
      })
    })
  })

  describe('Maybe.ap', () => {
    describe('when the applicative Maybe is Nothing', () => {
      it('returns a Nothing', () => {
        const result = Maybe.ap(Nothing(), Just(name))
        expect(result).toEqual(Nothing())
      })
    })

    describe('when the target Maybe is Nothing', () => {
      it('returns a Nothing', () => {
        const result = Maybe.ap(Just(toUpper))(Nothing())
        expect(result).toEqual(Nothing())
      })
    })

    describe('when both the applicative and target Maybes are Justs', () => {
      it('applies the wrapped function in the applicative Maybe to value in the target Maybe', () => {
        const result = Maybe.ap(Just(toUpper), Just(name))
        expect(result).toEqual(Just(toUpper(name)))
      })
    })
  })

  describe('pure', () => {
    it('returns a Just', () => {
      const result = Maybe.pure(name)
      expect(result.type).toBe(MaybeType.Just)
      expect(result.value).toBe(name)
    })
  })
})
