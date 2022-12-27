// deno-lint-ignore-file no-explicit-any

import { isObject, isPromise } from './types.ts'
import { flattenObjectKeys, getProperty, setProperty } from './object-utils.ts'

type TypePartialUndefined<T> = T | Partial<T> | undefined
type Value<T> = TypePartialUndefined<T> | Promise<TypePartialUndefined<T>>

interface NotifyEvent<T> {
  key: string
  value: Value<T>
  name: string
}

type NotifyEventCallback<T> = (event: NotifyEvent<T>) => void

interface Subscribers<T> {
  [key: string]: NotifyEventCallback<T>[]
}

type Unsubscribe = () => void

type WatchArg<T> = string | { [key: string]: unknown } | NotifyEventCallback<T>

interface Observable<T> {
  (value?: any): T
  readonly name: string
  get(query?: any): T
  set(value: any): void
  watch(...args: WatchArg<T>[]): Unsubscribe
}

type DependenciesEntry = [string, Observable<unknown>, string]

class Dependencies {
  target?: Computed<unknown>
  enabled = true
}

const dependencies = new Dependencies()

class Watcher<T> {

  name = 'noname'
  watchers: Subscribers<T> = {}

  watch(...args: WatchArg<T>[]): Unsubscribe {
    const keys: string[] = args.length === 1 ? [''] : flattenObjectKeys(args[0])
    const callback = (args.length === 1 ? args[0] : args[1]) as NotifyEventCallback<T>

    if (typeof callback !== 'function') {
      throw new Error(`Watcher must be a function: ${typeof callback}`)
    }

    const watchers = this.watchers

    for (const key of keys) {
      if (!watchers[key]) {
        watchers[key] = []
      }
      watchers[key].push(callback)
    }

    return () => {
      // return unsubscribe
      const watchers = this.watchers
      for (const key of keys) {
        watchers[key] = watchers[key].filter(eventHandler => eventHandler !== callback)
        if (watchers[key].length === 0) {
          delete watchers[key]
        }
      }
    }
  }

  notify(key: string, value: T) {
    dependencies.enabled = false
    try {
      const watchers = this.watchers[key]
      if (watchers) {
        for (let i = 0; i < watchers.length; i++) {
          watchers[i]({ key, value, name: this.name })
        }
      }
    } finally {
      dependencies.enabled = true
    }
  }

  emit(entries: [string, any][]) {
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]
      this.notify(key, value)
    }
  }

}


class Reactive<T> extends Watcher<T> {

  value: Value<T>
  readonly context: Observable<T>

  constructor(value: Value<T>, name: string = '') {
    super()
    this.value = value
    this.context = this.initContext()
    this.name = name
  }

  trackDependencies(keys: string[]): void {
    if (dependencies.enabled && dependencies.target && dependencies.target !== this as unknown && !dependencies.target.deps.find(dep => dep[1] === this.context)) {
      dependencies.target.deps.push(...keys.map(key => [key, this.context, this.name]) as DependenciesEntry[])
    }
  }

  get(): Value<T> {
    // return this.value
    return this.context.get()
  }

  set(value: Value<T>): void {
    if (this.value !== value) {
      // console.log('#', 'set', [this.name, value])

      this.value = value
      this.notify('', value as T)
    }
  }

  initContext(): Observable<T> {

    if (this.context) {
      return this.context
    }

    const context = (value?: T) => {
      if (value !== undefined) {
        this.set(value)
      } else {
        return this.get()
      }
    }

    Object.defineProperty(context, 'name', {
      get: () => this.name
    })

    Object.defineProperty(context, 'get', {
      value: (query?: any): any => {

        // const value = this.get()
        const value = this.value

        if (query === undefined) {
          this.trackDependencies([''])
          return value
        }

        if (!isObject(value)) {
          this.trackDependencies([''])
          return undefined
        }

        if (!isObject(query)) {
          this.trackDependencies([query])
          return getProperty(value, query)
        }

        const keys = flattenObjectKeys(query)
        this.trackDependencies(keys)

        return keys.reduce((acc, key) => {
          setProperty(acc, key, getProperty(value, key))
          return acc
        }, {})

      }
    })

    Object.defineProperty(context, 'set', {
      value: (newValue: any): void => {

        // const value = this.get()

        if (!isObject(newValue)) {
          return this.set(newValue)
        }

        const value = this.value
        const keys = flattenObjectKeys(newValue)
        const entries: [string, any][] = []
        for (const key of keys) {
          const sourceValue = getProperty(newValue, key)
          if (setProperty(value, key, sourceValue)) {
            entries.push([key, sourceValue])
          }
        }
        this.emit(entries)
      }
    })

    Object.defineProperty(context, 'watch', {
      value: (...args: WatchArg<T>[]): () => void => {
        return this.watch(...args)
      }
    })

    return context as Observable<T>
  }


}

// ----------------------------------------------------------------

type Compute<T> = (value: Value<T>) => Value<T>

const KEYWORDS = [' if ', ' switch ', ['?', ':']]

class Computed<T> extends Reactive<T> {

  compute: Compute<T>
  dependencies: DependenciesEntry[]
  deps: DependenciesEntry[] = []
  dynamicDependencies: boolean
  subscribed = false

  constructor(compute: Compute<T>, dependencies?: Observable<T>[], name: string = '') {
    super(undefined, name)
    this.compute = compute
    this.dependencies = dependencies ? dependencies.map(context => ['', context, context.name]) as DependenciesEntry[] : []
    this.deps = [...this.dependencies]
    this.dynamicDependencies = this.isDynamicDependencies()
  }

  isDynamicDependencies(): boolean {
    const sourceCode = this.compute.toString()

    let found = false
    for (let i = 0; i < KEYWORDS.length; i++) {
      const keyword = KEYWORDS[i]
      if (Array.isArray(keyword)) {
        found = keyword.filter(word => sourceCode.includes(word)).length === keyword.length
      } else if (sourceCode.includes(keyword)) {
        found = true
      }
      if (found) {
        break
      }
    }

    return found
  }

  get(): Value<T> {
    // return cached value if not undefined
    // return this.value !== undefined ? this.value : this.computed()

    if (this.value === undefined) {
      this.computed()
    }

    return super.get()
  }

  set(): void {
    throw new TypeError('Cannot assign to read only property.')
  }

  computed(): void {

    // console.log('----- Get dependencies:', this.name)

    if (this.dynamicDependencies) {
      this.deps = [...this.dependencies]
    }

    dependencies.target = this as Computed<unknown>
    try {
      const value = this.compute(this.value)

      if (isPromise(value)) {
        (value as Promise<T>)
          .then((newValue: T) => {
            super.set(newValue)
          })
      }

      super.set(value)

    } finally {
      dependencies.target = undefined

      if (this.deps.length > 0 && !this.subscribed || this.dynamicDependencies) {
        console.log('>', this.name, 'depend on:', this.deps.map(([_, __, name]) => name))
      }

      if (!this.subscribed || this.dynamicDependencies) {
        this.subscribed = true
        const unsubscribes: Unsubscribe[] = this.deps.map(([key, context]) => context.watch(key, ({ key, value, name }) => {
          // dependencies value changed, reset cache
          // console.log('! dependencies value changed', ['me:', this.name], ['dep:', name, key, value])

          if (this.dynamicDependencies) {
            for (let i = 0; i < unsubscribes.length; i++) {
              unsubscribes[i]()
            }
          }

          // invalidate cache, recomputed value and dependencies
          this.value = undefined
          this.computed()
        }))
      }

    }
  }

}


// ----------------------------------------------------------------


export function $<T>(value: Value<T> | Compute<T>, name?: string, dependencies?: Observable<T>[]) {
  return typeof value === 'function'
    ? new Computed<T>(value as Compute<T>, dependencies, name).context
    : new Reactive<T>(value, name).context
}


// ----------------------------------------------------------------

const firstName = $('Indra', 'firstName')
const lastName = $('Gunawan', 'lastName')
const time = $(`time: ${new Date().toLocaleString('sv').split(' ')[1]}`, 'time')

const oddValue = $('Odd!', 'oddValue')
const evenValue = $('Even!', 'evenValue')
const isOdd = $(true, 'isOdd')

// computed
const fullName = $(() => firstName() + ' ' + lastName(), 'fullName')
const fullNameWithTime = $(() => fullName() + ', ' + time(), 'fullNameWithTime')

// const isOdd = $((value) => !value, 'isOdd')
const fullNameWithTimeAndOddEven = $(() => fullNameWithTime() + `, isOdd: ${isOdd() ? oddValue() : evenValue()}`, 'fullNameWithTimeAndOddEven')

// test computed async

const loading = $(false, 'loading')
const url = $('https://www.google.com', 'url')

const loadAsyncData = $(() => {
  loading(true)
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`! async result ${url()} ${new Date().toLocaleString('sv')}`)
      loading(false)
    }, 5000)
  })
}, 'loadAsyncData', [url])

loading.watch(async ({ key, value, name }) => {
  // console.log('?', ['watch'], 'fullNameWithTime', [name, key])
  console.log('?', 'loading', await loading())
})

loadAsyncData.watch(async ({ key, value, name }) => {
  // console.log('?', ['watch'], 'fullNameWithTime', [name, key])
  console.log('?', 'loadAsyncData', await loadAsyncData())
})

console.log(firstName())
console.log(lastName())
console.log(time())
console.log(isOdd())

console.log(1, fullName())
console.log(2, fullNameWithTime())

fullNameWithTime.watch(({ key, value, name }) => {
  // console.log('?', ['watch'], 'fullNameWithTime', [name, key])
  console.log('?', 'fullNameWithTime', [fullNameWithTime()])
  // console.log(' ', fullNameWithTime())
})

const unsubscribe = fullNameWithTimeAndOddEven.watch(({ key, value, name }) => {
  // console.log('?', ['watch'], 'fullNameWithTimeAndOddEven', [name, key])
  console.log('?', 'fullNameWithTimeAndOddEven', [fullNameWithTimeAndOddEven()])
})

// setTimeout(unsubscribe, 6000)

console.log(fullNameWithTimeAndOddEven())

setInterval(async () => {
  console.log('.')
  // console.log()
  // firstName('Mr. ' + Math.random()) // set dependencies firstName state

  // time(`time: ${new Date().toLocaleString('sv').split(' ')[1]}`) // set dependencies time state
  // isOdd(!isOdd())
  // console.log(isOdd())

  url('https://' + Math.random())
  console.log(await loadAsyncData())
}, 2000)

// ----------------------------------------------------------------

// const fullName = $(() => {
//   // console.log('fullName', 'calculated')
//   return firstName() + ' ' + lastName()
// }, 'fullName')

// const fullNameWithTime = $(() => {
//   // console.log('fullNameWithTime', 'calculated')
//   return fullName() + ' ' + time()
// }, 'fullNameWithTime')


// ----------------------------------------------------------------

// const state = $({
//   id: 100,
//   name: 'Samsung',
//   address: {
//     primary: 'Depok',
//     secondary: 'Jember'
//   }
// })

// console.log(state.get('name'))
// console.log(state.get({ name: 1 }))

// console.log(state.get('address.primary'))
// console.log(state.get({ address: 1 }))
// console.log(state.get({ address: { primary: 1 } }))

// state.set('name')

// console.log(state.get('name'))
// console.log(state.get({ name: 1 }))