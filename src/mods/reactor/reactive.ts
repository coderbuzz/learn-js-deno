import { Value, Context, DependenciesEntry } from './types.ts'
import { dependencies } from './dependencies.ts'
import { Watcher } from './watcher.ts'
import { Contextable, initContext } from './context.ts'

export function isObservable(fn: unknown): boolean {
  return typeof fn === 'function' && typeof (fn as Context<unknown>).watch === 'function'
}

export class Reactive<T> extends Watcher<T> implements Contextable<T> {

  value: Value<T>
  readonly context: Context<T> = initContext<T>(this)

  constructor(value: Value<T>, name: string = '') {
    super()
    this.value = value
    this.name = name
  }

  trackDependencies(keys: string[]): void {
    if (dependencies.target && dependencies.enabled && dependencies.target as unknown !== this) {
      dependencies.target.deps.push(this.context, ...keys.map(key => [key, this.context, this.name]) as DependenciesEntry[])
    }
  }

  get(): Value<T> {
    return this.context.get()
  }

  set(value: Value<T>): void {
    if (this.value !== value) {
      // console.log('#', 'set', [this.name, value])

      this.value = value
      this.notify('', value)
    }
  }

}
