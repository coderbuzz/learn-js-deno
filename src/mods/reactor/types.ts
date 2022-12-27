import { HashTable } from './classes.ts'
type TypePartialUndefined<T> = T | Partial<T> | undefined
export type Value<T> = TypePartialUndefined<T> | Promise<TypePartialUndefined<T>>

export interface NotifyEvent<T> {
  key: string
  value: Value<T>
  name: string
}

export type NotifyEventCallback<T> = (event: NotifyEvent<T>) => void

export interface Subscribers<T> {
  [key: string]: NotifyEventCallback<T>[]
}

export type Unsubscribe = () => void

export type WatchArg<T> = string | { [key: string]: unknown } | NotifyEventCallback<T>

export interface Context<T = unknown> {
  (value?: T): T
  readonly name: string
  get(query?: unknown): Value<T>
  /*
    set object or array by key
    array: { 0: 'Array 0 set' }
  */
  set(value: Value<T> | Record<number|string, unknown>): void
  watch(...args: WatchArg<T>[]): Unsubscribe
  deps: HashTable<DependenciesEntry>
}

export interface DependenciesContext<T> extends Context<T> {
  watchDependencies(...args: WatchArg<T>[]): Unsubscribe
}

export type DependenciesEntry = [string, DependenciesContext<unknown>, string]

export type Compute<T> = (value: Value<T>) => Value<T>
