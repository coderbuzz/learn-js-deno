type GetIndexValue<T> = (item: T) => unknown

export class HashTable<T> {
  #items: T[] = []
  #indices = new Set<unknown>()
  #getIndexValue: GetIndexValue<T>

  constructor(getIndexValue: GetIndexValue<T>) {
    this.#getIndexValue = getIndexValue
  }

  get items(): T[] {
    return this.#items
  }

  set items(items: T[]) {
    const getIndexValue = this.#getIndexValue
    this.#items = items.slice(0)
    this.#indices = new Set<unknown>()
    for (let i = 0; i < items.length; i++) {
      this.#indices.add(getIndexValue(items[i]))
    }
  }

  add(item: T): boolean {
    const index = this.#getIndexValue(item)
    if (!this.#indices.has(index)) {
      this.#indices.add(index)
      this.#items.push(item)
      return true
    }
    return false
  }

  has(index: unknown): boolean {
    return this.#indices.has(index)
  }

  get map() {
    return this.#items.map.bind(this.#items)
  }

  push(index: unknown, ...items: T[]) {
    if (!this.#indices.has(index)) {
      this.#indices.add(index)
      this.#items.push(...items)
    }
  }

  get length(): number {
    return this.#items.length
  }
}
