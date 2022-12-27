
export type LifecycleCallback = () => void
export type RemoveCallback = () => void

export interface LifecycleTarget {
  onMount: LifecycleCallback[]
  onDestroy: LifecycleCallback[]
}

class Lifecycle {
  target?: LifecycleTarget
}

export const lifecycle = new Lifecycle()

function dummy() { }

function register(registry: LifecycleCallback[], callback: LifecycleCallback): RemoveCallback {
  registry.push(callback)

  // return uninstall callback
  return () => {
    const index = registry.indexOf(callback)
    if (index >= -1) {
      registry.splice(index, 1)
    }
  }
}

export function onMount(callback: LifecycleCallback): RemoveCallback {
  return lifecycle.target ? register(lifecycle.target.onMount, callback) : dummy
}

export function onDestroy(callback: LifecycleCallback) {
  return lifecycle.target ? register(lifecycle.target.onDestroy, callback) : dummy
}
