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

  parent?: VNode
  tag: Tag = ''
  props: Props
  children: Array<VNode> = []
  value: string

  constructor(
    tag: Tag,
    props: Props,
    value?: unknown
  ) {
    this.props = props
    this.value = String(value || '')

    if (props.children) {
      this.append(props.children)
      delete props.children
    }

    this.setTag(tag)
  }

  setTag(tag: Tag) {
    if (typeof tag === 'function') {

      let render: FunctionComponent

      if (typeof (tag as ClassComponent).prototype.render === 'function') {
        const component = new (tag as ClassComponent)()
        tag = render = component.render.bind(component)
      } else {
        render = tag as FunctionComponent
      }

      const value = render(this.props)

      if (typeof value === 'function') {
        console.log('observable ---------------')

        const observable = $(value, 'tag')

        observable.watch('*', ({ key, value }) => {
          // console.log(tag, key, value)
          this.parent?.setChildren(value)

          if (invalidateCallback) {
            invalidateCallback()
          }
        })

        this.append(observable())
      } else {
        this.append(value)
      }
    }

    this.tag = tag
  }

  setChildren(children: unknown) {
    this.children = []
    this.append(children)
    // if (Array.isArray(children)) {
    //   this.append(...children)
    // } else {
    //   this.append(children)
    // }
  }

  // append(...children: Array<unknown>) {
  append(children: unknown) {
    const childs = Array.isArray(children) ? children : [children]

    for (let i = 0; i < childs.length; i++) {
      let child = childs[i]
      // console.log(typeof child, '>>')

      if (!(child instanceof VNode)) {
        child = new VNode('', {}, child)
      }

      (child as VNode).parent = this
      this.children.push(child as VNode)
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

  // const children = props.children || []
  // if (props.children) {
  //   delete props.children
  // }

  // delete props.children

  // node.setChildren(children)

  // return {
  //   tag,
  //   props,
  //   children
  // }
  return node
}

export { jsx, jsx as jsxs, jsx as Fragment }

// console.log('%cOh my heavens! ', 'background: #222; color: #bada55');
