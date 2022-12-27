import { HashTable } from './classes.ts'
import { Unsubscribe, Value, Context, DependenciesEntry, Compute } from './types.ts'
import { isPromise } from './utils.ts'
import { dependencies, Target } from './dependencies.ts'
import { Reactive } from './reactive.ts'

const KEYWORDS = [' if ', ' switch ', ['?', ':']]

export class Computed<T> extends Reactive<T> implements Target {

  compute: Compute<T>
  dependencies: DependenciesEntry[]
  deps = new HashTable<DependenciesEntry>((record) => record[1])

  dynamicDependencies: boolean
  subscribed = false

  constructor(compute: Compute<T>, dependencies?: Context<T>[], name: string = '') {
    super(undefined, name)
    this.compute = compute
    this.dependencies = dependencies ? dependencies.map(context => ['', context, context.name]) as DependenciesEntry[] : []
    this.deps.items = this.dependencies
    this.dynamicDependencies = this.isDynamicDependencies()
    this.computed()
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
    if (this.value === undefined) {
      this.computed()
    }
    // return cached value
    return super.get()
  }

  set(): void {
    throw new TypeError('Cannot assign to read only property.')
  }

  computed(): void {
    if (this.dynamicDependencies) {
      this.deps.items = this.dependencies
    }

    dependencies.target = this as Computed<unknown>
    try {
      // const value = this.compute(this.value)

      let value = this.compute(this.value)

      while (typeof value === 'function') {
        if (typeof (value as unknown as Context<unknown>).watch === 'function') {
          /*
          const jktTimes = $(['J', 'K', 'T'], 'jktTimes')

          // value is reactive context but not called, like this:
          // you can use both jktTimes or jktTimes() it works

          const jakartaTimes = $(() => jktTimes)
          const jakartaTimes = $(() => jktTimes())
          */

          value = value()
        } else {
          break
        }
      }

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
        console.log('⚡️', 'Tracking', [this.name], 'depend on:', this.deps.map(([_, __, name]) => name))
      }

      if (!this.subscribed || this.dynamicDependencies) {
        this.subscribed = true
        // const unsubscribes: Unsubscribe[] = this.deps.map(([key, context]) => context.watchDependencies(key, () => { // key
        const unsubscribes: Unsubscribe[] = this.deps.map(([_, context]) => context.watchDependencies('*', () => {
          // dependencies value changed, reset cache
          // console.log('! dependencies value changed', ['me:', this.name], ['dep:', name, key, value])
          
          // console.log('⚡️', [this.name], 'dependencies value changed:', [context.name, context()])

          if (this.dynamicDependencies) {
            for (let i = 0; i < unsubscribes.length; i++) {
              unsubscribes[i]()
            }
          }

          // invalidate cache, re-computed value and re-evaluate dynamic dependencies
          this.value = undefined
          this.computed()
        }))
      }

    }
  }

}
