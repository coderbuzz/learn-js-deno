import { Tag, Props, ClassComponent, FunctionComponent } from './h-types.ts'
import * as VDOM from './dom-types.ts'
import { createComponent } from './component.ts'
import { $ } from '../../reactor/mod.ts'


// class ReactiveNode {

// }


class Runtime {

  evaluate(node: VDOM.Node, props: Props): VDOM.Node {

    return node
  }

  createComponent(tag: Tag, props: Props): VDOM.Node {
    console.log('>', 'createComponent')
    if (typeof (tag as ClassComponent).render === 'function') {
      const component = new (tag as ClassComponent)()
      tag = component.render.bind(component)
    }
    // console.log(tag)
    // const element = (tag as FunctionComponent)(props, children)
    // return element

    // return new Component(tag as FunctionComponent, props, children) as Element //.element

    // console.log(tag, props, children)
    // return this.evaluate(createComponent(tag as FunctionComponent, props, children), props, children)
    // console.log(element)

    return this.evaluate((tag as FunctionComponent)(props), props)
  }

  createDocumentFragment(children: unknown[]): VDOM.Node {
    console.log('>', 'createDocumentFragment')
    return this.evaluate(document.createDocumentFragment() as VDOM.Node, {})
  }

  createElement(tagName: string, props: Props): VDOM.Element {
    console.log('>', 'createElement')
    return this.evaluate(document.createElement(tagName) as VDOM.Node, props) as VDOM.Element

    // for (const name in props) {
    //   const value = props[name]
    //   if (typeof value === 'string') {
    //     element.setAttribute(name, value)
    //   } else {
    //     // console.log(`prop '${name}' is ${typeof value}: ${JSON.stringify(value)}`)
    //     console.log(`prop '${name}' is ${typeof value}:`, value)
    //   }
    // }
    // return element
  }

}

export const runtime = new Runtime()
