import { Tag, Attrs, ClassComponent, FunctionComponent } from './h-types.ts'
import { Element, ElementWithAttributes } from './dom-types.ts'
import { createComponent } from './component.ts'
import { $ } from '../../reactor/mod.ts'


// class ReactiveNode {

// }


class Runtime {

  evaluate(element: Element, attrs: Attrs, children: unknown[]): Element {

    return element
  }

  createComponent(tag: Tag, attrs: Attrs, children: unknown[]): Element {
    console.log('>', 'createComponent')
    if (typeof (tag as ClassComponent).render === 'function') {
      const component = new (tag as ClassComponent)()
      tag = component.render.bind(component)
    }
    // console.log(tag)
    // const element = (tag as FunctionComponent)(attrs, children)
    // return element

    // return new Component(tag as FunctionComponent, attrs, children) as Element //.element

    // console.log(tag, attrs, children)
    return this.evaluate(createComponent(tag as FunctionComponent, attrs, children), attrs, children)
    // console.log(element)
  }

  createDocumentFragment(children: unknown[]): Element {
    console.log('>', 'createDocumentFragment')
    return this.evaluate(document.createDocumentFragment() as Element, {}, children)
  }

  createElement(tagName: string, attrs: Attrs, children: unknown[]): Element {
    console.log('>', 'createElement')
    return this.evaluate(document.createElement(tagName) as Element, attrs, children)

    // for (const name in attrs) {
    //   const value = attrs[name]
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
