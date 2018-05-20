import { Maybe } from './Maybe'

export interface HashMap<T> {
  [key: string]: T
}

export class Dict<T> {
  public static empty<T> (): Dict<T> {
    return new Dict({})
  }

  public static singleton<T> (key: string, value: T): Dict<T> { // curry it
    return new Dict({
      [key]: value,
    })
  }

  public static get<T> (key: string, dict: Dict<T>): Maybe<T> { // curry it
    return Maybe.fromNullable(dict._store[key])
  }

  // it’s questionable whether or not we actually need this:
  public static fromList<T> (list: ReadonlyArray<[ string, T ]>): Dict<T> {
    const store: HashMap<T> = list.reduce(
      (cumulativeStore: HashMap<T>, [ key, val ]: [ string, T ]) => ({
        ...cumulativeStore,
        [key]: val,
      }),
      {},
    )
    return new Dict(store)
  }

  public static fromHashMap<T> (hashMap: HashMap<T>): Dict<T> {
    return new Dict(hashMap)
  }

  public static insert<T> (key: string, val: T, dict: Dict<T>): Dict<T> { // curry it
    const store: HashMap<T> = dict._store
    const newStore: HashMap<T> = {
      ...store,
      [key]: val,
    }
    return new Dict(newStore)
  }

  public static member<T> (key: string, dict: Dict<T>): boolean { // curry it
    return key in dict._store
  }

  public static update<T> (key: string, transform: (val: T) => T, dict: Dict<T>): Dict<T> { // curry it
    if (!this.member(key, dict)) return dict
    const store: HashMap<T> = dict._store
    const newStore: HashMap<T> = {
      ...store,
      [key]: transform(store[key]),
    }
    return new Dict(newStore)
  }

  public static remove<T> (key: string, dict: Dict<T>): Dict<T> { // curry it
    const {
      [key]: _,
      ...rest,
    } = dict._store
    return new Dict(rest)
  }

  public static isEmpty<T> (dic: Dict<T>): boolean {
    return Object.keys(dic._store).length === 0
  }

  public static size<T> (dict: Dict<T>): number {
    return Object.keys(dict._store).length
  }

  public static keys<T> (dict: Dict<T>): ReadonlyArray<string> {
    return Object.keys(dict._store)
  }

  public static values<T> (dict: Dict<T>): ReadonlyArray<T> {
    return Object.values(dict._store)
  }

  public static toHashMap<T> (dict: Dict<T>): HashMap<T> {
    return { ...dict._store }
  }

  public static map<A, B> (f: (key: string, val: A) => B, dict: Dict<A>): Dict<B> { // curry it
    const store = dict._store
    const newStore: HashMap<B> = Object.keys(store).reduce(
      (cumulativeStore: HashMap<B>, key: string) => ({
        ...cumulativeStore,
        [key]: f(key, store[key]),
      }),
      {},
    )
    return new Dict(newStore)
  }

  public static filter<T> (predicate: (key: string, val: T) => boolean, dict: Dict<T>): Dict<T> { // curry it
    const store = dict._store
    const newStore: HashMap<T> = Object.keys(store).reduce(
      (cumulativeStore: HashMap<T>, key: string) => {
        const val: T = store[key]
        if (!predicate(key, val)) return { ...cumulativeStore }
        return {
          ...cumulativeStore,
          [key]: val,
        }
      },
      {},
    )
    return new Dict(newStore)
  }

  public static reduce<A, B> (f: (key: string, val: A, accum: B) => B, initial: B, dict: Dict<A>): B { // curry it
    const store = dict._store
    return Object.keys(store).reduce(
      (accum: B, key: string) => f(key, store[key], accum),
      initial,
    )
  }

  public static union<T> (first: Dict<T>, second: Dict<T>): Dict<T> { // curry it
    const newStore: HashMap<T> = { ...second._store, ...first._store }
    return new Dict(newStore)
  }

  private _store: HashMap<T>

  private constructor (store: HashMap<T>) {
    this._store = store
  }
}
