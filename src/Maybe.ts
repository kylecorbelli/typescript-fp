export enum MaybeType {
  Just = '_maybe-type__just',
  Nothing = '_maybe-type__nothing',
}

export interface Just<T> {
  type: MaybeType.Just
  value: T
}

export interface Nothing {
  type: MaybeType.Nothing
}

export type Maybe<T>
  = Just<T>
  | Nothing

export const Just = <T> (val: T): Just<T> => ({
  type: MaybeType.Just,
  value: val,
})

export const Nothing = (): Nothing => ({
  type: MaybeType.Nothing,
})

function fromNullable <T> (val: T | null | undefined): Maybe<T> {
  return val === null || val === undefined
    ? Nothing()
    : Just(val)
}

const mapSwitch = <A, B> (f: (val: A) => B, m: Maybe<A>): Maybe<B> => {
  switch (m.type) {
    case MaybeType.Nothing:
      return Nothing()
    case MaybeType.Just:
      return Just(f(m.value))
  }
}

function maybeMap<A, B> (f: (val: A) => B): (m: Maybe<A>) => Maybe<B>
function maybeMap<A, B> (f: (val: A) => B, m: Maybe<A>): Maybe<B>
function maybeMap<A, B> (f: (val: A) => B, m?: Maybe<A>) {
  return m === undefined
    ? (maybe: Maybe<A>): Maybe<B> => mapSwitch(f, maybe)
    : mapSwitch(f, m)
}

const andThenSwitch = <A, B> (f: (val: A) => Maybe<B>, m: Maybe<A>): Maybe<B> => {
  switch (m.type) {
    case MaybeType.Nothing:
      return Nothing()
    case MaybeType.Just:
      return f(m.value)
  }
}

function maybeAndThen<A, B> (f: (val: A) => Maybe<B>, m: Maybe<A>): Maybe<B>
function maybeAndThen<A, B> (f: (val: A) => Maybe<B>): (m: Maybe<A>) => Maybe<B>
function maybeAndThen<A, B> (f: (val: A) => Maybe<B>, m?: Maybe<A>) {
  return m === undefined
    ? (maybe: Maybe<A>): Maybe<B> => andThenSwitch(f, maybe)
    : andThenSwitch(f, m)
}

const withDefaultSwitch = <T>(defaultVal: T, m: Maybe<T>): T => {
  switch (m.type) {
    case MaybeType.Nothing:
      return defaultVal
    case MaybeType.Just:
      return m.value
  }
}

function maybeWithDefault<T> (defaultVal: T): (m: Maybe<T>) => T
function maybeWithDefault<T> (defaultVal: T, m: Maybe<T>): T
function maybeWithDefault<T> (defaultVal: T, m?: Maybe<T>) {
  return m === undefined
    ? (maybe: Maybe<T>): T => withDefaultSwitch(defaultVal, maybe)
    : withDefaultSwitch(defaultVal, m)
}

const apHelper = <A, B> (f: Maybe<(val: A) => B>, m: Maybe<A>): Maybe<B> => {
  return f.type === MaybeType.Nothing || m.type === MaybeType.Nothing
    ? Nothing()
    : Just(f.value(m.value))
}

function maybeAp<A, B> (f: Maybe<(val: A) => B>, m: Maybe<A>): Maybe<B>
function maybeAp<A, B> (f: Maybe<(val: A) => B>): (m: Maybe<A>) => Maybe<B>
function maybeAp<A, B> (f: Maybe<(val: A) => B>, m?: Maybe<A>) {
  return m === undefined
    ? (maybe: Maybe<A>): Maybe<B> => apHelper(f, maybe)
    : apHelper(f, m)
}

export const Maybe = {
  andThen: maybeAndThen,
  ap: maybeAp,
  fromNullable,
  map: maybeMap,
  pure: Just,
  withDefault: maybeWithDefault,
}
