/**
 * HTML Document representation Browser's HTML DOM to be use in Deno environment
 * This can be use as SSR
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
 * 
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */


export enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3
}

export interface Node {
  readonly nodeType: NodeType
  readonly parentNode?: Node
  nodeValue?: string
  readonly childNodes: Array<Node>
  appendChild(node: Node): Node
  removeChild(node: Node): Node
}

export interface Text extends Node {
  readonly wholeText: string
}

export interface DOMTokenList {
  contains(token: string): boolean
  add(...tokens: string[]): void
  remove(...tokens: string[]): void
  replace(oldToken: string, newToken: string): boolean
  toggle(token: string, force?: boolean): boolean
}

export type Attributes = Record<string, string>

export interface Element extends Node {
  readonly tagName: string
  readonly attributes: Attributes
  readonly classList: DOMTokenList
  readonly children: Array<Element>
  append(...nodes: Array<Node | string>): void
  setAttribute(name: string, value: string): void
  remove(): void
  removeAttribute(attrName: string): void
  
}

export interface ElementCreationOptions {
  is: string
}
