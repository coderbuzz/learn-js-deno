/**
 * JSX Builder
 * Ref: https://www.typescriptlang.org/docs/handbook/jsx.html
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { Tag, Props, ClassComponent, FunctionComponent } from './h-types.ts'
// import { document, VElement } from './vdom.ts'
// import { VElement } from './vdom.ts'
// import * as VDOM from './dom-types.ts'
// import { runtime } from './runtime.ts'
import { $ } from '../../reactor/mod.ts'

let invalidateCallback: () => void

export function invalidate(callback: () => void) {
  invalidateCallback = callback
}


function jsx(tag: Tag | typeof jsx, props: Props): unknown {

  if (tag === jsx) {
    // ignore fragment
    return props.children
  }
  else if (typeof tag === 'function') {
    // console.log(tag, props)

    let render: FunctionComponent

    if (typeof (tag as ClassComponent).prototype.render === 'function') {
      const component = new (tag as ClassComponent)(props)

      Object.defineProperty(component, 'props', {
        get: () => props
      })

      console.log('> component created', component.props)

      render = tag = component.render.bind(component)
    } else {
      render = tag as FunctionComponent
    }

    const value = render(props)

    if (typeof value === 'function') {
      // console.log('observable ---------------')
      const observable = $(value, tag.name)

      if (observable.deps.length > 0) {
        console.log('observing ---------------')

        observable.watch('*', ({ key, value }) => {
          // console.log(tag, key, value)
          if (invalidateCallback) {
            invalidateCallback()
          }
        })
      }

      props.children = observable()
    } else {
      props.children = value
    }

  }

  if (props.children) {
    if (!Array.isArray(props.children)) {
      props.children = [props.children]
    } else {
      // remove undefined
      props.children = props.children.filter(item => item)
    }
  }

  return {
    tag,
    props,
  }

}

export { jsx, jsx as jsxs, jsx as Fragment }

// console.log('%cOh my heavens! ', 'background: #222; color: #bada55');
