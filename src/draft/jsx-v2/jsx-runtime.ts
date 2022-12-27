/**
 * JSX Builder
 * Ref: https://www.typescriptlang.org/docs/handbook/jsx.html
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { Tag, Attrs, ClassComponent, FunctionComponent } from './h-types.ts'
// import { document, VElement } from './vdom.ts'
// import { VElement } from './vdom.ts'
import { Element } from './dom-types.ts'
import { runtime } from './runtime.ts'
// import { $ } from '../../reactor/mod.ts'

// import './html-attributes.ts'

// const computed = $(() => {
//   console.log('computed')
// })


// let call = 0

type MaybeHasChildren = {
  children?: unknown[]
}

function jsx(tag: Tag | typeof jsx, props: Attrs & MaybeHasChildren, ...children: unknown[]): Element {

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

export { jsx, jsx as jsxs, jsx as Fragment }

// console.log('%cOh my heavens! ', 'background: #222; color: #bada55');
