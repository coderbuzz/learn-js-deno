import { WatchArg, Value, Context, DependenciesEntry, Unsubscribe } from './types.ts'
import { isObject, flattenObjectKeys, getProperty, setProperty } from './utils.ts'
import { HashTable } from './classes.ts'

export interface Contextable<T> {
  value: Value<T>
  name: string;
  trackDependencies(keys: string[]): void
  get(): Value<T>
  set(value: Value<T>): void
  watch(...args: WatchArg<T>[]): Unsubscribe
  watchDependencies(...args: WatchArg<T>[]): Unsubscribe
  emit(entries: [string, Value<T>][]): void
  deps?: HashTable<DependenciesEntry>
}

export function initContext<T>(contextable: Contextable<T>): Context<T> {

  const context = (value?: T): Value<T> => {
    if (value !== undefined) {
      contextable.set(value)
    } else {
      return contextable.get()
    }
  }

  Object.defineProperty(context, 'name', {
    get: () => contextable.name
  })

  Object.defineProperty(context, 'valueOf', {
    value: (): Value<T> => {
      // console.log('valueOf', contextable.name)
      return contextable.get()
    }
  })

  Object.defineProperty(context, 'toString', {
    value: (): string => {
      // console.log('toString', contextable.name)
      return String(contextable.get())
    }
  })

  Object.defineProperty(context, 'get', {
    value: (query?: unknown): Value<T> => {

      const value = contextable.value

      // console.log('  >', contextable.name, value)

      if (query === undefined) {
        contextable.trackDependencies([''])
        return value
      }

      if (!isObject(value)) {
        contextable.trackDependencies([''])
        return undefined
      }

      if (!isObject(query)) {
        contextable.trackDependencies([query as string])
        return getProperty(value, query as string) as Value<T>
      }

      const keys = flattenObjectKeys(query)
      contextable.trackDependencies(keys)

      return keys.reduce((acc, key) => {
        setProperty(acc, key, getProperty(value, key))
        return acc
      }, {})

    }
  })

  Object.defineProperty(context, 'set', {
    value: (newValue: Value<T>): void => {

      if (!isObject(newValue)) {
        return contextable.set(newValue)
      }

      const value = contextable.value
      const keys = flattenObjectKeys(newValue)
      const entries: [string, Value<T>][] = []
      for (const key of keys) {
        const sourceValue = getProperty(newValue, key) as Value<T>
        if (setProperty(value, key, sourceValue)) {
          entries.push([key, sourceValue])
        }
      }
      contextable.emit(entries)
    }
  })

  Object.defineProperty(context, 'watch', {
    value: (...args: WatchArg<T>[]): () => void => {
      return contextable.watch(...args)
    }
  })

  Object.defineProperty(context, 'watchDependencies', {
    value: (...args: WatchArg<T>[]): () => void => {
      return contextable.watchDependencies(...args)
    }
  })

  Object.defineProperty(context, 'deps', {
    get: () => contextable.deps
  })

  return context as Context<T>
}