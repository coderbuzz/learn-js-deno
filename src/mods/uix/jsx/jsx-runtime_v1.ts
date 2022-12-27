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

// import './html-attributes.ts'

// const computed = $(() => {
//   console.log('computed')
// })


// let call = 0

/*
type MaybeHasChildren = {
  children?: unknown[]
}


function jsxXX(tag: Tag | typeof jsx, props: Attrs & MaybeHasChildren, ...children: unknown[]): Element {

  let node: Element

  if (props) {
    if (props.children) {
      children = Array.isArray(props.children) ? props.children : [props.children]
      delete props.children
    }
  } else {
    props = {}
  }

  // children = children.flat()
  // if (!Array.isArray(children)) {
  //   children = [children]
  // }

  // console.log(++call, tag, props,)

  // computed()

  if (tag === jsx) node = runtime.createDocumentFragment(children)
  else if (typeof tag === 'function') {
    // if (typeof tag.prototype.render === 'function') {
    //   const component = new (tag as ClassComponent)()
    //   tag = component.render.bind(component)
    // }
    // // console.log(tag)
    // return (tag as FunctionComponent)(props)
    return runtime.createComponent(tag as FunctionComponent | ClassComponent, props, children)
  }
  else node = runtime.createElement(tag as string, props, children)



  // moved to runtime handler

  // for (const name in props) {
  //   const value = props[name]
  //   if (typeof value === 'string') {
  //     node.setAttribute(name, value)
  //   } else {
  //     console.log(`prop '${name}' is object: ${value}`)
  //   }
  // }

  // console.log(children)

  // console.log(call, node)

  // node.append(...children.flat() as unknown[])
  // node.append(children.flat())

  // node.append(...(children as Array<unknown>).flat())

  // console.log('LEN', children.flat().length)

  // console.log('....', children.length, children.toString())

  // Array.isArray(children)
  //   ? node.append(...children.flat())
  //   : node.append(children)

  node.append(...children as Array<Element | string>)

  return node
}

*/

/* v2

function jsx(tag: Tag | typeof jsx, props: Props): VDOM.Node | VDOM.Node[] {
  // console.log(tag, props)

  let node: VDOM.Node

  if (props.children && !Array.isArray(props.children)) {
    props.children = [props.children]
  }

  if (tag === jsx) {
    node = document.createDocumentFragment() as VDOM.Node
  }
  else if (typeof tag === 'function') {
    if (typeof (tag as ClassComponent).render === 'function') {
      const component = new (tag as ClassComponent)()
      tag = component.render.bind(component)
    }

    const nodes = (tag as FunctionComponent)(props)

    if (Array.isArray(nodes)) {
      node = document.createDocumentFragment() as VDOM.Node
      (node as VDOM.DocumentFragment).append(...nodes as Array<VDOM.Node | string>)
      return node.childNodes as unknown as VDOM.Node[]
    } else {
      return nodes
    }

  } else {
    node = document.createElement(tag as string) as VDOM.Node
  }

  if (props.children) {
    if (!Array.isArray(props.children)) {
      props.children = [props.children]
    }
    (node as VDOM.Element).append(...props.children as Array<VDOM.Node | string>)
  }

  return node as VDOM.Node
}
 */


/*
function jsx(tag: Tag | typeof jsx, props: Props): VDOM.Node | VDOM.Node[] {
  // console.log(tag, props)

  let node: VDOM.Node

  if (props.children && !Array.isArray(props.children)) {
    props.children = [props.children]
  }

  if (tag === jsx) {
    node = document.createDocumentFragment() as VDOM.Node
  }
  else if (typeof tag === 'function') {
    if (typeof (tag as ClassComponent).render === 'function') {
      const component = new (tag as ClassComponent)()
      tag = component.render.bind(component)
    }

    let value = (tag as FunctionComponent)(props)

    // console.log(value)

    if (typeof value === 'function') {
      const render = $(value, 'render')
      render.watch('*', ({ key, value, name}) => {
        // console.log('render', key, name)

        console.log(`***** ${value}`)
      })
      value = render()
    } 

    if (Array.isArray(value)) {
      node = document.createDocumentFragment() as VDOM.Node
      (node as VDOM.DocumentFragment).append(...value as Array<VDOM.Node | string>)
      return node.childNodes as unknown as VDOM.Node[]
    } else {
      return value
    }

  } else {
    node = document.createElement(tag as string) as VDOM.Node
  }

  if (props.children) {
    if (!Array.isArray(props.children)) {
      props.children = [props.children]
    }
    (node as VDOM.Element).append(...props.children as Array<VDOM.Node | string>)
  }

  return node as VDOM.Node
} */

interface Props {
  [name: string]: unknown
  children?: unknown
}

type FunctionComponent = (props: Props) => VNode

type ClassComponent = {
  new(): ClassComponent
  render: FunctionComponent
}

type Tag = string | FunctionComponent | ClassComponent

interface VNode {
  tag: Tag // | typeof jsx
  props: Props
  // parent: VNode
  children: unknown
  // component?: FunctionComponent | ClassComponent
}

let invalidateCallback: () => void

export function invalidate(callback: () => void) {
  invalidateCallback = callback
}

function jsx(tag: Tag | typeof jsx, props: Props): VNode {
  // console.log(tag, props)

  if (tag === jsx) {
    tag = '<>'
  }
  else if (typeof tag === 'function') {
    // console.log(tag, props)
    // return (tag as FunctionComponent)(props)
    tag = (tag as FunctionComponent)

    const value = tag(props)

    if (typeof value === 'function') {
      console.log('observable ---------------')
      const observable = $(value, 'tag')

      observable.watch('*', ({ key, value }) => {
        // console.log(tag, key, value)
        if (invalidateCallback) {
          invalidateCallback()
        }
      })

      props.children = observable()
    } else {
      props.children = value
    }

  }

  const children = props.children || []
  if (props.children) {
    delete props.children
  }

  return {
    tag,
    props,
    children
  }
}

export { jsx, jsx as jsxs, jsx as Fragment }

// console.log('%cOh my heavens! ', 'background: #222; color: #bada55');
