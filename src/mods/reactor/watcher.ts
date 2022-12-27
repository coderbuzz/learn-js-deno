import { Value, Subscribers, WatchArg, Unsubscribe, NotifyEventCallback } from './types.ts'
import { flattenObjectKeys } from './utils.ts'
import { dependencies } from './dependencies.ts'

export class Watcher<T> {

  name = 'noname'
  watchers: Subscribers<T> = {}
  dependenciesWatchers: Subscribers<T> = {}

  /*
    Special keys:
    - '' (empty string) -> subscribe to root assignment
    - '*' (asterisk string) -> subscribe to root and all keys assignment
  */

  watchX(watchers: Subscribers<T>, args: WatchArg<T>[]): Unsubscribe {
    const keys: string[] = args.length === 1 ? [''] : flattenObjectKeys(args[0])
    const callback = (args.length === 1 ? args[0] : args[1]) as NotifyEventCallback<T>

    if (typeof callback !== 'function') {
      throw new Error(`Watcher must be a function: ${typeof callback}`)
    }

    for (const key of keys) {
      if (!watchers[key]) {
        watchers[key] = []
      }
      watchers[key].push(callback)

      // if (key === '' || key === '*') {
      // // TODO: call watcher immediately?
      //   callback()
      // }
    }

    return () => {
      // return unsubscribes
      for (const key of keys) {
        watchers[key] = watchers[key].filter(eventHandler => eventHandler !== callback)
        if (watchers[key].length === 0) {
          delete watchers[key]
        }
      }
    }
  }

  watch(...args: WatchArg<T>[]): Unsubscribe {
    // console.log(args)
    return this.watchX(this.watchers, args)
  }

  watchDependencies(...args: WatchArg<T>[]): Unsubscribe {
    // console.log(args)
    return this.watchX(this.dependenciesWatchers, args)
  }

  notify(key: string, value: Value<T>): void {

    const notify = (key: string, ...watchers: NotifyEventCallback<T>[][]) => {
      for (let i = 0; i < watchers.length; i++) {
        const subscribers = watchers[i]
        if (subscribers) {
          for (let i = 0; i < subscribers.length; i++) {
            subscribers[i]({ key, value, name: this.name })
          }
        }
      }
    }

    dependencies.enabled = false
    try {
      notify(key, this.watchers[key])
      notify(key, this.watchers['*']) // also call all (*) subscribers
    } finally {
      dependencies.enabled = true
    }

    notify(key, this.dependenciesWatchers[key])
    notify(key, this.dependenciesWatchers['*']) // also call all (*) subscribers
  }

  emit(entries: [string, Value<T>][]): void {
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]
      this.notify(key, value)
    }
  }

}
