export interface Element {
  parentNode?: Element
  addEventListener<T>(type: string, listener: (data: T) => void): void
  dispatchEvent(event: Event): void
  append(...nodes: Array<Element | string>): void
}

export interface ElementWithAttributes extends Element {
  setAttribute(name: string, value: string): void
}
