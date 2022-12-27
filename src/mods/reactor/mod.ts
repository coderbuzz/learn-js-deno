import { Value, Compute, Context, NotifyEventCallback, NotifyEvent } from './types.ts'
import { Reactive, isObservable } from './reactive.ts'
import { Computed } from './computed.ts'

export type { Context as Reactive, Context as Observable, NotifyEventCallback, NotifyEvent }
export { isObservable }

type NameOrDependencies<T> = string | Context<T>[]

export function $<T>(value: Value<T> | Compute<T>, ...options: NameOrDependencies<T>[]): Context<T> {
  let name, dependencies

  if (typeof options[0] === 'string') {
    name = options[0] as string
    dependencies = options[1] as Context<T>[]
  } else {
    dependencies = options[0] as Context<T>[]
    name = options[1] as string
  }
  if (dependencies && !Array.isArray(dependencies)) {
    dependencies = [dependencies]
  }
  return typeof value === 'function'
    ? new Computed<T>(value as Compute<T>, dependencies, name).context
    : new Reactive<T>(value, name).context
}
