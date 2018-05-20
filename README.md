# TypeScript FP

[![CircleCI](https://circleci.com/gh/kylecorbelli/typescript-fp.svg?style=shield)](https://circleci.com/gh/kylecorbelli/typescript-fp)

[![codecov](https://codecov.io/gh/kylecorbelli/typescript-fp/branch/master/graph/badge.svg)](https://codecov.io/gh/kylecorbelli/typescript-fp)

## What is This?
This is a type-safe collection of functional programming utilities and types. It is heavily inspired by Elm and Haskell.

## Installation
From the command line:
```
$ npm install --save typescript-fp
```
In your TypeScript files:
```TypeScript
import { Maybe } from 'typescript-fp'
```

## Maybe Type Definition
```TypeScript
interface Just<T> {
  type: MaybeType.Just
  value: T
}

interface Nothing {
  type: MaybeType.Nothing
}

type Maybe<T>
  = Just<T>
  | Nothing
```

## Constructors
```TypeScript
const Just = <T>(val: T): Just<T> => ({
  type: MaybeType.Just,
  value: val,
})

const Nothing = (): Nothing => ({
  type: MaybeType.Nothing,
})
```

## Module Utility Functions
These utility functions are all pure and curried.

#### Maybe.map
Applies the provided function to the provided `Maybe` only if it is not `Nothing`. Returns a `Nothing` otherwise.
###### Type Annotation
```TypeScript
<A, B> (f: (val: A) => B, m: Maybe<A>) => Maybe<B>
```
###### Example Usage
```TypeScript
const toUpper = (text: string): string => text.toUpperCase()
Maybe.map(toUpper, Just('noob noob')) // Just('NOOB NOOB')
Maybe.map(toUpper, Nothing()) // Nothing()
```

#### Maybe.withDefault
Provided a default value and a `Maybe`, will return the default value when the `Maybe` is `Nothing`. Will return the "wrapped" value of the `Maybe` if it is a `Just`.
###### Type Annotation
```TypeScript
<T> (defaultVal: T, m: Maybe<T>) => T
```
###### Example Usage
```TypeScript
Maybe.withDefault('morty', Just('rick')) // 'rick'
Maybe.withDefault('morty', Nothing()) // 'morty'
```

#### Maybe.andThen
Used for chaining functions that take a raw value of type `T` but return a `Maybe<T>`. This is like Haskell's `bind` or `>>=`.
###### Type Annotation
```TypeScript
<A, B> (func: (val: A) => Maybe<B>, m: Maybe<A>) => Maybe<B>
```
###### Example Usage
```TypeScript
import { compose, curry } from 'ramda'

// Some arbitrary function that returns a Maybe<number>:
const safeDivide = curry((a: number, b: number): Maybe<number> => {
  return a === 0
    ? Nothing()
    : Just(b / a)
})

compose(
  Maybe.andThen(safeDivide(3)),
  Maybe.andThen(safeDivide(0)), // "fails" here
  Maybe.andThen(safeDivide(4)),
  safeDivide(2),
)(32) // Nothing()

compose(
  Maybe.andThen(safeDivide(3)),
  Maybe.andThen(safeDivide(5)),
  Maybe.andThen(safeDivide(4)),
  safeDivide(2),
)(32) // Just(0.5333333333333333)
```

#### Maybe.ap
# THIS NEEDS TO BE UPDATED... MAYBE DEFINE lift FUNCTIONS:
Used for writing in the applicative style. For "lifting" curried functions into the `Maybe` context.
###### Type Annotation
```TypeScript
Maybe.ap<A, B> :: (targetNullable: Maybe<A>): (applicativeNullable: Maybe<(val: A) => B>) => Maybe<B>
```
###### Example Usage
```TypeScript
// Some arbitrary curried function that takes 3 concrete values:
const addThreeNumbers = (a: number) => (b: number) => (c: number) => a + b + c

compose(
  Maybe.ap(3),
  Maybe.ap(2),
  Maybe.ap(1),
)(addThreeNumbers) // 6

// This can be thought of as "lifting" addThreeNumbers into the context of its passed-in arguments being Maybe:
compose(
  Maybe.ap(3),
  Maybe.ap(null as Maybe<number>), // note we have to typecast this here because TypeScript can’t be sure what kind of Maybe<T> it has at this point.
  Maybe.ap(1),
)(addThreeNumbers) // null
```
