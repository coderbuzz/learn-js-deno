import { FunctionComponent, ClassComponent } from './h-types.ts'

export type NodeValue = null | string

export interface Node {
  readonly parent?: Node
  readonly childNodes: NodeListOf<ChildNode> // Array<Node>
  readonly parentNode?: Node
  readonly isConnected: boolean
  readonly firstChild?: Node
  readonly nodeValue: NodeValue

  appendChild(node: Node): Node
  removeChild(node: Node): Node
}

export interface DocumentFragment extends Node {
  // append(...nodes: Array<Element | string | FunctionComponent | ClassComponent>): void
  append(...nodes: Array<Node | string>): void
}

export interface Element extends Node {
  addEventListener<T>(type: string, listener: (data: T) => void): void
  dispatchEvent(event: Event): void
  append(...nodes: Array<Node | string>): void
  setAttribute(name: string, value: string): void
}
