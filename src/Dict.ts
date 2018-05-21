import { Maybe } from './Maybe'

export interface HashMap<T> {
  [key: string]: T
}

export class Dict<T> {
  public static empty<T> (): Dict<T> {
    return new Dict({})
  }

  public static singleton<T> (key: string, value: T): Dict<T>
  public static singleton<T> (key: string): (value: T) => Dict<T>
  public static singleton<T> (key: string, value?: T) {
    return value === undefined
      ? (v: T): Dict<T> => this.singletonHelper(key, v)
      : this.singletonHelper(key, value)
  }

  public static get<T> (key: string, dict: Dict<T>): Maybe<T>
  public static get<T> (key: string): (dict: Dict<T>) => Maybe<T>
  public static get<T> (key: string, dict?: Dict<T>) {
    return dict === undefined
      ? (d: Dict<T>): Maybe<T> => this.getHelper(key, d)
      : this.getHelper(key, dict)
  }

  public static fromHashMap<T> (hashMap: HashMap<T>): Dict<T> {
    return new Dict(hashMap)
  }

  public static insert<T> (key: string, val: T, dict: Dict<T>): Dict<T>
  public static insert<T> (key: string, val: T): (dict: Dict<T>) => Dict<T>
  public static insert<T> (key: string, val: T, dict?: Dict<T>) {
    return dict === undefined
      ? (d: Dict<T>): Dict<T> => this.insertHelper(key, val, d)
      : this.insertHelper(key, val, dict)
  }

  public static member<T> (key: string, dict: Dict<T>): boolean
  public static member<T> (key: string): (dict: Dict<T>) => boolean
  public static member<T> (key: string, dict?: Dict<T>) {
    return dict === undefined
      ? (d: Dict<T>): boolean => this.memberHelper(key, d)
      : this.memberHelper(key, dict)
  }

  public static update<T> (key: string, transform: (val: T) => T, dict: Dict<T>): Dict<T>
  public static update<T> (key: string, transform: (val: T) => T): (dict: Dict<T>) => Dict<T>
  public static update<T> (key: string, transform: (val: T) => T, dict?: Dict<T>) {
    return dict === undefined
      ? (d: Dict<T>): Dict<T> => this.updateHelper(key, transform, d)
      : this.updateHelper(key, transform, dict)
  }

  public static remove<T> (key: string, dict: Dict<T>): Dict<T>
  public static remove<T> (key: string): (dict: Dict<T>) => Dict<T>
  public static remove<T> (key: string, dict?: Dict<T>) {
    return dict === undefined
      ? (d: Dict<T>): Dict<T> => this.removeHelper(key, d)
      : this.removeHelper(key, dict)
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

  public static map<A, B> (f: (key: string, val: A) => B, dict: Dict<A>): Dict<B>
  public static map<A, B> (f: (key: string, val: A) => B): (dict: Dict<A>) => Dict<B>
  public static map<A, B> (f: (key: string, val: A) => B, dict?: Dict<A>) {
    return dict === undefined
      ? (d: Dict<A>): Dict<B> => this.mapHelper(f, d)
      : this.mapHelper(f, dict)
  }

  public static filter<T> (predicate: (key: string, val: T) => boolean, dict: Dict<T>): Dict<T>
  public static filter<T> (predicate: (key: string, val: T) => boolean): (dict: Dict<T>) => Dict<T>
  public static filter<T> (predicate: (key: string, val: T) => boolean, dict?: Dict<T>) {
    return dict === undefined
      ? (d: Dict<T>): Dict<T> => this.filterHelper(predicate, d)
      : this.filterHelper(predicate, dict)
  }

  public static reduce<A, B> (f: (key: string, val: A, accum: B) => B, initial: B, dict: Dict<A>): B
  public static reduce<A, B> (f: (key: string, val: A, accum: B) => B, initial: B): (dict: Dict<A>) => B
  public static reduce<A, B> (f: (key: string, val: A, accum: B) => B, initial: B, dict?: Dict<A>) {
    return dict === undefined
      ? (d: Dict<A>): B => this.reduceHelper(f, initial, d)
      : this.reduceHelper(f, initial, dict)
  }

  public static union<T> (first: Dict<T>, second: Dict<T>): Dict<T>
  public static union<T> (first: Dict<T>): (second: Dict<T>) => Dict<T>
  public static union<T> (first: Dict<T>, second?: Dict<T>) {
    return second === undefined
      ? (s: Dict<T>): Dict<T> => this.unionHelper(first, s)
      : this.unionHelper(first, second)
  }

  private static memberHelper<T> (key: string, dict: Dict<T>): boolean {
    return key in dict._store
  }

  private static getHelper<T> (key: string, dict: Dict<T>): Maybe<T> {
    return Maybe.fromNullable(dict._store[key])
  }

  private static singletonHelper<T> (key: string, value: T): Dict<T> {
    return new Dict({
      [key]: value,
    })
  }

  private static removeHelper<T> (key: string, dict: Dict<T>): Dict<T> {
    const {
      [key]: _,
      ...rest,
    } = dict._store
    return new Dict(rest)
  }

  private static mapHelper<A, B> (f: (key: string, val: A) => B, dict: Dict<A>): Dict<B> {
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

  private static filterHelper<T> (predicate: (key: string, val: T) => boolean, dict: Dict<T>): Dict<T> {
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

  private static unionHelper<T> (first: Dict<T>, second: Dict<T>): Dict<T> {
    const newStore: HashMap<T> = { ...second._store, ...first._store }
    return new Dict(newStore)
  }

  private static insertHelper<T> (key: string, val: T, dict: Dict<T>): Dict<T> {
    const store: HashMap<T> = dict._store
    const newStore: HashMap<T> = {
      ...store,
      [key]: val,
    }
    return new Dict(newStore)
  }

  private static updateHelper<T> (key: string, transform: (val: T) => T, dict: Dict<T>): Dict<T> {
    if (!this.member(key, dict)) return dict
    const store: HashMap<T> = dict._store
    const newStore: HashMap<T> = {
      ...store,
      [key]: transform(store[key]),
    }
    return new Dict(newStore)
  }

  private static reduceHelper<A, B> (f: (key: string, val: A, accum: B) => B, initial: B, dict: Dict<A>): B {
    const store = dict._store
    return Object.keys(store).reduce(
      (accum: B, key: string) => f(key, store[key], accum),
      initial,
    )
  }

  private _store: HashMap<T>

  private constructor (store: HashMap<T>) {
    this._store = store
  }
}
