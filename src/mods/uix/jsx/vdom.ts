/**
 * HTML Document representation Browser's HTML DOM to be use in Deno environment
 * This can be use as SSR
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
 * 
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import * as VDOM from './vdom-types.ts'
import { serialize } from './vdom-serialize.ts'

// export * from './vdom-types.ts'

class Node implements VDOM.Node {

  parent?: VDOM.Node
  childNodes: Array<VDOM.Node> = []

  constructor(
    public readonly nodeType: VDOM.NodeType,
    public readonly nodeValue?: string,
  ) { }

  get parentNode(): VDOM.Node | undefined {
    return this.parent
  }

  appendChild(node: VDOM.Node): VDOM.Node {
    if (node.parentNode) {
      node.parentNode.removeChild(node)
    }
    (node as Node).parent = this
    this.childNodes.push(node)
    return node
  }

  removeChild(node: VDOM.Node): VDOM.Node {
    const index = this.childNodes.indexOf(node)
    if (index >= 0) {
      this.childNodes.splice(index, 1)
    }
    return node
  }

}


class DOMTokenList implements VDOM.DOMTokenList {

  private readonly tokens = new Set<string>()

  contains(token: string): boolean {
    return this.tokens.has(token)
  }

  add(...tokens: string[]): void {
    for (const token of tokens) {
      this.tokens.add(token)
    }
  }

  remove(...tokens: string[]): void {
    for (const token of tokens) {
      this.tokens.delete(token)
    }
  }

  replace(oldToken: string, newToken: string): boolean {
    if (this.tokens.has(oldToken)) {
      return false
    }
    this.tokens.delete(oldToken)
    this.tokens.add(newToken)
    return true
  }

  toggle(token: string, force?: boolean): boolean {
    if (this.tokens.has(token) || force === false) {
      this.tokens.delete(token)
      return false
    } else {
      this.tokens.add(token)
      return true
    }
  }

}


class Text extends Node implements VDOM.Node {

  constructor(text: string) {
    super(VDOM.NodeType.TEXT_NODE, text)
  }

  get wholeText(): string {
    return this.nodeValue || '' + this.childNodes.map(node => node.nodeValue || '').join('')
  }

}


class Element extends Node implements VDOM.Element {

  readonly attributes: VDOM.Attributes = {}
  readonly classList: DOMTokenList = new DOMTokenList();

  constructor(
    public readonly tagName: string,
    private readonly options?: VDOM.ElementCreationOptions
  ) {
    super(VDOM.NodeType.ELEMENT_NODE)
  }

  get children(): Array<VDOM.Element> {
    return this.childNodes as Array<VDOM.Element>
  }

  append(...nodes: Array<VDOM.Node | string>): void {
    for (let node of nodes) {
      // console.log(node, typeof node);
      if (typeof node !== 'object') {
        node = new Text(node)
      }
      this.appendChild(node)
    }
  }

  setAttribute(name: string, value: string): void {
    this.attributes[name] = value
  }

  removeAttribute(attrName: string): void {
    delete this.attributes[attrName]
  }

  remove(): void {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
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


export class Document {

  createElement(tagName: string, options?: VDOM.ElementCreationOptions): VDOM.Element {
    return new Element(tagName, options)
  }

  createTextNode(text: string): VDOM.Text {
    return new Text(text)
  }

}

export const document = new Document()
