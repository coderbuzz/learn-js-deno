/**
 * JSX Builder
 * Ref: https://www.typescriptlang.org/docs/handbook/jsx.html
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { Tag, Props, FunctionComponent, ClassComponent, HResult, Computed } from './h-types.ts'

import { VNode } from './runtime.ts'
import { $, Observable, NotifyEventCallback, NotifyEvent } from '../../reactor/mod.ts'

// let invalidateCallback: () => void

export function invalidate(callback: () => void) {
  //   invalidateCallback = callback
}

// function jsx(tag: Tag | typeof jsx, props: Props): unknown {
//   return tag === jsx ? props.children : new VNode(tag as Tag, props)
// }


// function observe(render: FunctionComponent) {

// }

function observe(observable: Observable<unknown>, callback: NotifyEventCallback<unknown>) {
  if (observable.deps.length > 0) {
    // console.log(['observing >'], observable.name)
    observable.watch('*', callback)
  }
  return observable()
}


function observer(computed: Computed, callback: NotifyEventCallback<unknown>, name: string): unknown {
  let observable = $(computed, name)
  let value = observe(observable, callback)

  while (typeof value === 'function') {
    observable = $(value as Computed, name)
    value = observe(observable, callback)
  }

  return value
}


function observeComponent(tag: FunctionComponent | ClassComponent, props: Props) {

  const render: FunctionComponent = (() => {

    if (typeof (tag as ClassComponent).prototype.render === 'function') {
      const component = new (tag as ClassComponent)(props)

      Object.defineProperty(component, 'props', {
        get: () => props
      })

      console.log(['component created >'], tag.name, component.props)

      return tag = component.render.bind(component)
    } else {
      return tag as FunctionComponent
    }
  })()

  /*
  const observe = (observable: Observable<unknown>) => {
    if (observable.deps.length > 0) {
      console.log(['observing >'], observable.name)

      observable.watch('*', ({ name, value }) => {
        console.log('computed', [name], 'changed!', value)

        // this.patch(parent, value)
        // this.observeChildren(parent, toArray(value))
      })
    }
    return observable()
  }*/

  /* DOC ----
    function Times({ times }: TimesProps) {
      const time = $(new Date().toLocaleString('sv').split(' ')[1], 'time')

      setInterval(() => {
        time(new Date().toLocaleString('sv').split(' ')[1])
      }, 1000)

      // support return nodes or function

      return <div>{time}</div>)           // Note: Times component will called each time time changed
      return () => <div>{time} </div>)    // Note: This returned function will called each time time changed
    }
  */

  const patchElement = ({ name, value }: NotifyEvent<unknown>) => {
    console.log('computed-element', [name], 'changed!', value)

    // TODO: Patch Diff
    props.children = value

    console.dir(value, { depth: 20 })
  }

  // console.log(props)

  /*
    let observable = $(() => render(props), tag.name)
    let value = observe(observable, patchElement)

    while (typeof value === 'function') {
      observable = $(value as Computed, tag.name)
      value = observe(observable, patchElement)
    }

    // console.log([typeof value], value)
    props.children = value
  */

  props.children = observer(() => render(props), patchElement, tag.name)
}


function observeAttributes(props: Props) {

  const patchAttribute = (prop: string) => {
    return ({ name, value }: NotifyEvent<unknown>) => {
      console.log('computed-props', [name], 'changed!', value)
      props[prop] = value
      // TODO: sync attributes

      // console.log(props)
      console.dir(props, { depth: 20 })
    }
  }

  for (const prop in props) {
    const attribute = props[prop]

    // console.log([prop], '=>', [attribute])

    if (prop === 'children' || typeof attribute !== 'function') {
      continue
    }

    /*
      let observable = $(() => attribute(), `prop.${prop}`)
      let value = observe(observable, patchAttribute(prop))

      while (typeof value === 'function') {
        observable = $(value as Computed, `prop.${prop}`)
        value = observe(observable, patchAttribute(prop))
      }
      

      props[prop] = value
      // console.log([typeof value], value)
    */

    props[prop] = observer(() => attribute(), patchAttribute(prop), `prop.${prop}`)

  }
}


function observeChildren(props: Props) {

  /**
   * children could be string, number, boolean, (reactive) function or component (object with tag: render function)
   * ... or array of them
   * return <pre>{caption} {num} {time} {children} <Clock /></pre>
   */

  const patchChildren = (index: number) => {
    return ({ name, value }: NotifyEvent<unknown>) => {
      console.log('computed-children', [name], 'changed!', value);

      (props.children as unknown[])[index] = value
      // TODO: sync patch Element

      console.dir(props.children, { depth: 20 })
    }
  }

  const children: Array<unknown> = props.children = (Array.isArray(props.children) ? props.children : [props.children])
    .flat(2)
    .filter(child => child !== undefined && child !== null)


  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    const typeOfNode = typeof node

    // console.log('node', typeOfNode)

    if (typeOfNode === 'object' && (node as HResult).props) {
      observeChildren((node as HResult).props)
    } else if (typeOfNode === 'function') {
      children[i] = observer(() => (node as Computed)(), patchChildren(i), `children[${i}]`)
      // TODO: Check children[i], if value is primitive then create Text Node
    } else {
      // TODO: Create Text Node
    }
  }

}


function jsx(tag: Tag | typeof jsx, props: Props): unknown {
  // return tag === jsx ? props.children : new VNode(tag as Tag, props)

  if (tag === jsx) {
    return props.children
  } else if (typeof tag === 'function') {
    observeComponent(tag as FunctionComponent | ClassComponent, props)
    observeAttributes(props)
    observeChildren(props)
  }

  return {
    tag,
    props,
  }

}

export { jsx, jsx as jsxs, jsx as Fragment }

// console.log('%cOh my heavens! ', 'background: #222; color: #bada55');
