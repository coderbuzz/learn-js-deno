/**
 * HTML Document representation Browser's HTML DOM to be use in Deno environment
 * This can be use as SSR
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node
 * 
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { serialize } from './vdom-serialize.ts'

type NodeValue = null | string

type Constructor<T> = {
  new(): T
}

export class Node {

  protected parent?: Node
  childNodes: Array<Node> = []

  get nodeType(): number {
    return 0
  }

  get parentNode() {
    return this.parent
  }

  get isConnected() {
    return Boolean(this.parent)
  }

  get firstChild(): Node | undefined {
    return this.childNodes[0]
  }

  get nodeValue(): NodeValue {
    return null
  }

  set nodeValue(_: NodeValue) {

  }

  appendChild(node: Node): Node {
    if (node.parentNode) {
      node.parentNode.removeChild(node)
    }
    node.parent = this
    this.childNodes.push(node)
    return node
  }

  removeChild(node: Node): Node {
    const index = this.childNodes.indexOf(node)
    if (index >= 0) {
      this.childNodes.splice(index, 1)
    }
    return node
  }

  protected assign(source: Node) {
    this.childNodes = [...source.childNodes]
  }

  cloneNode(): Node {
    const node = new (this.constructor as Constructor<Node>)()
    node.assign(this)
    return node
  }

}


interface CharacterData {
  data: string
  length: number
}


export class Text extends Node implements CharacterData {

  data: string

  constructor(text: string) {
    super()
    this.data = String(text)
  }

  get nodeType(): number {
    return 3 // TEXT_NODE
  }

  get nodeValue(): NodeValue {
    return this.data
  }

  set nodeValue(value: NodeValue) {
    this.data = String(value)
  }

  // get data(): string {
  //   return this.data
  // }

  get length() {
    return this.data.length
  }

  toString(): string {
    return this.data
  }

  protected assign(source: Text) {
    this.data = source.data
    super.assign(source)
  }

}


interface ElementCreationOptions {
  is: string
}

export type Attributes = Record<string, string>

export class Element extends Node {

  tagName: string
  options?: ElementCreationOptions
  attributes: Attributes = {}

  constructor(tagName: string, options?: ElementCreationOptions) {
    super()
    this.tagName = tagName || ''
    this.options = options
  }

  get nodeType(): number {
    return 1 // ELEMENT_NODE
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value
  }

  append(...nodes: Array<Node | string>): void {
    for (let node of nodes) {
      // console.log(node, typeof node);
      if (!(node instanceof Node)) {
        node = new Text(node)
      }
      this.appendChild(node)
    }
  }

  get innerHTML(): string {
    return serialize(this, false)
  }

  get outerHTML(): string {
    return serialize(this, true)
  }

  toString(): string {
    return this.outerHTML
  }

  protected assign(source: Element) {
    this.tagName = source.tagName
    this.options = source.options
    this.attributes = { ...source.attributes }
    super.assign(source)
  }

}


export class HTMLElement extends Element {

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  attachShadow(_: Record<string, unknown>): Node {
    return this
  }

  appendChild(node: Node): Node {
    const result = super.appendChild(node)
    this.connectedCallback()
    return result
  }

  removeChild(node: Node): Node {
    const result = super.removeChild(node)
    this.disconnectedCallback()
    return result
  }

}

export class DocumentFragment extends Element {

  constructor() {
    super('')
  }

  // append(...nodes: Array<Node | string>): void {
  //   // console.log('append', nodes);
  //   for (let node of nodes) {
  //     // console.log(node, typeof node);
  //     if (!(node instanceof Node)) {
  //       node = new Text(node)
  //     }
  //     this.appendChild(node)
  //   }
  // }

  // toString(): string {
  //   return serialize(this, true)
  // }

}


export class Document {

  // createDocumentFragment(): Node {
  //   return new DocumentFragment()
  // }

  createElement(tagName: string, options?: ElementCreationOptions): Element {
    return new Element(tagName, options)
  }

  createTextNode(text: string): Text {
    return new Text(text)
  }

}

// export const document = new Document()
