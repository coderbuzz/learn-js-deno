import { HashTable } from './classes.ts'
import { DependenciesEntry } from './types.ts'

export interface Target {
  deps: HashTable<DependenciesEntry>
}

class Dependencies {
  enabled = true
  // target?: Target

  #target?: Target

  get target(): Target | undefined {
    return this.#target
  }

  set target(value: Target | undefined) {
    // console.log('set target', value)
    this.#target = value
  }
}

export const dependencies = new Dependencies()
