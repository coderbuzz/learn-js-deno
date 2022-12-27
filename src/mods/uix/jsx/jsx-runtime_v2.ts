/**
 * JSX Builder
 * Ref: https://www.typescriptlang.org/docs/handbook/jsx.html
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

// import { Tag, Props, ClassComponent, FunctionComponent } from './h-types.ts'
// import { document, VElement } from './vdom.ts'
// import { VElement } from './vdom.ts'
import * as VDOM from './dom-types.ts'
import { runtime } from './runtime.ts'
import { $ } from '../../reactor/mod.ts'


interface HProps {
  [name: string]: unknown
  children?: unknown
}

type FunctionComponent = (props: HProps) => unknown

type ClassComponent = {
  new(): ClassComponent
  render: FunctionComponent
}

type Tag = string | FunctionComponent | ClassComponent

// interface VNode {
//   tag: Tag // | typeof jsx
//   props: Props
//   // parent: VNode
//   children: unknown
//   // component?: FunctionComponent | ClassComponent
// }

type Props = Record<string, unknown>

class VNode {

  #tag: Tag = ''
  #parent?: VNode
  #children: Array<VNode> = []
  #value: string | null = null

  constructor(
    // public readonly tag: Tag,
    tag: Tag,
    public readonly props: Props,
    // children: Array<unknown>
  ) {
    // this.children = children
    this.tag = tag
  }

  get tag() {
    return this.#tag
  }

  set tag(tag: Tag) {
    if (typeof tag === 'function') {
      if (typeof (tag as ClassComponent).render === 'function') {
        const component = new (tag as ClassComponent)()
        tag = component.render.bind(component)
      }

      tag = (tag as FunctionComponent)

      const value = tag(this.props)

      if (typeof value === 'function') {
        console.log('observable ---------------')

        const observable = $(value, 'tag')

        observable.watch('*', ({ key, value }) => {
          // console.log(tag, key, value)
          if (invalidateCallback) {
            invalidateCallback()
          }
        })

        this.children = observable()
      } else {
        this.children = value
      }
    }

    this.#tag = tag
  }

  get parent(): VNode | undefined {
    return this.#parent
  }

  get value(): string | null {
    return this.#value
  }

  set value(value: string | null) {
    this.#value = value
  }

  get children(): Array<VNode> {
    return this.#children
  }

  set children(children: unknown) {
    this.#children = []
    if (Array.isArray(children)) {
      this.append(...children)
    } else {
      this.append(children)
    }
  }

  append(...children: Array<unknown>) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      console.log(typeof child, child)

      this.#children.push(child as VNode)
    }
  }

}


let invalidateCallback: () => void

export function invalidate(callback: () => void) {
  invalidateCallback = callback
}

function jsx(tag: Tag | typeof jsx, props: HProps): VNode {
  // console.log(tag, props)

  let node: VNode

  if (tag === jsx) {
    // tag = '<>'
    node = new VNode('<>', props as Props)
  }
  else {
    node = new VNode(tag as Tag, props as Props)
  }

  const children = props.children || []
  if (props.children) {
    delete props.children
  }

  node.children = children

  // return {
  //   tag,
  //   props,
  //   children
  // }
  return node
}

export { jsx, jsx as jsxs, jsx as Fragment }

// console.log('%cOh my heavens! ', 'background: #222; color: #bada55');
