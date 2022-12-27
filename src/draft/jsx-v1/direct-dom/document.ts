/**
 * HTML Document representation Browser's HTML DOM to be use in Deno environment
 * This can be use as SSR
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node
 * 
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { serialize } from './document-serialize.ts'

export class Node {

  protected parent?: Node
  readonly childNodes: Array<Node> = []

  get parentNode() {
    return this.parent
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

}


interface CharacterData {
  data: string
  length: number
}


export class Text extends Node implements CharacterData {

  readonly data: string

  constructor(text: string) {
    super()
    this.data = text
  }

  get length() {
    return this.data.length
  }

}


interface ElementCreationOptions {
  is: string
}

export type Attributes = Record<string, string>

// export interface Element {
//   readonly tagName: string
//   readonly options?: ElementCreationOptions
//   readonly attributes: Attributes

//   setAttribute(name: string, value: string): void
//   append(...nodes: Array<Node | string>): void

//   readonly innerHTML: string
//   readonly outerHTML: string
// }

export class Element extends Node {

  readonly tagName: string
  readonly options?: ElementCreationOptions
  readonly attributes: Attributes = {}

  constructor(tagName: string, options?: ElementCreationOptions) {
    super()
    this.tagName = tagName
    this.options = options
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value
  }

  append(...nodes: Array<Node | string>): void {
    for (let node of nodes) {
      if (typeof node === 'string') {
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

}


export class DocumentFragment extends Element {

  constructor() {
    super('')
  }

}


export class Document {

  createDocumentFragment(): Element {
    return new DocumentFragment()
  }

  createElement(tagName: string, options?: ElementCreationOptions): Element {
    return new Element(tagName, options)
  }

  createTextNode(text: string): Text {
    return new Text(text)
  }
}

export const document = new Document()
