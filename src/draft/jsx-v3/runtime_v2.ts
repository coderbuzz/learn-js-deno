import { Tag, Props, ClassComponent, FunctionComponent } from './h-types.ts'
import * as VDOM from './dom-types.ts'
import { Context } from '../../reactor/types.ts'
import { $ } from '../../reactor/mod.ts'

type Computed = () => unknown

export class VNode {

  parent?: VNode
  // tag: Tag = ''
  // props: Props
  // children: Array<VNode> = []
  // value?: string

  element?: Node
  props: Props

  constructor(
    tag: Tag,
    props: Props,
    value?: unknown
  ) {
    // if (tag && typeof tag === 'string') {
    //   this.element = document.createElement(tag) //as VDOM.Element
    // } else {
    //   this.element = document.createTextNode(String(value || ''))
    // }

    // console.log(['tag', tag])
    this.props = props

    /**
     * tag: '' = Text node
     * tag: string = Element
     * tag: FunctionComponent | ClassComponent = observable
     */

    if (value === '') {
      this.element = document.createTextNode(String(value))
    } else if (typeof tag === 'string') {
      this.element = document.createElement(tag)
    }

    this.setup(tag, props)
  }

  setup(tag: Tag, props: Props) {
    if (typeof tag === 'function') {

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

      const value = render(props)

      if (typeof value === 'function') {
        props.children = this.observe(this, value as Computed, tag.name)
      } else {
        props.children = value
      }

    }

    // if (props.children) {
    //   if (!Array.isArray(props.children)) {
    //     props.children = [props.children]
    //   } else {
    //     // remove undefined
    //     props.children = props.children.filter(item => item)
    //   }

    //   // this.observeChildren(props)
    // }

    this.patch(this, props.children)
  }

  patch(parent: VNode, children: unknown) {
    if (children) {
      if (!Array.isArray(children)) {
        children = [children]
      } else {
        // remove undefined
        children = children.filter(item => item)
      }

      this.observeChildren(parent, children as Array<unknown>)
    }
  }

  observe(parent: VNode, computed: Computed, name: string): unknown {
    // console.log('observable ---------------')
    const observable = $(computed, name)

    if (observable.deps.length > 0) {
      console.log(['observing >'], name)

      observable.watch('*', ({ value }) => {
        console.log('computed', name, 'changed!')

        this.patch(parent, value)
      })
    }

    // props.children = observable()
    return observable()
  }

  observeChildren(parent: VNode, children: Array<unknown>) {
    // console.log(['child >'], children)

    const childrens: Array<VNode> = []

    const convertChild = (children: Array<unknown>) => {
      for (const child of children) {
        if (child instanceof VNode) {
          childrens.push(child)
        } else if (Array.isArray(child)) {
          convertChild(child)
        } else {
          console.log([typeof child], child)
          if (typeof child === 'function') {
            // console.log(parent)
            // console.log(this.observe(parent, child, child.name))
            const value = this.observe(parent, child as Computed, child.name)
            console.log('SDAasdADS', typeof value, value)
            convertChild(parent, value)

            // if (Array.isArray(value)) {
            //   // childrens.push(...convertChild(value))
            //   convertChild(parent, value)
            // } else {
            //   console.log('SDAasdADS', value)
            //   // childrens.push(value as VNode)
            //   convertChild(parent, value)
            // }

          } else {
            childrens.push(new VNode('', {}, child))
          }

        }
      }
    }
    convertChild(children)

    parent.props.children = childrens
  }

  observeAttributes(props: Props) {

  }

  get outerHTML(): string {
    if (this.element) {
      if (this.element.nodeType === 1) { // Node.ELEMENT_NODE
        return (this.element as Element).outerHTML
      } else {
        return (this.element as Text).nodeValue || ''
      }
    } else {
      return (this.props.children as Array<VNode>).map((child: VNode) => child.outerHTML).join('\n')
    }
    // } else if (this.props.children) {
    //   console.log('ARRAAAAY')
    //   return (this.props.children as Array<VNode>).map((child: VNode) => child.outerHTML).join('\n')
    // } else {
    //   console.log('KOSSSSONG')
    //   return ''
    // }
  }

}

export function render(nodes: VNode | VNode[]): string {
  if (!Array.isArray(nodes)) {
    nodes = [nodes]
  }

  return nodes.map(node => node ? node.outerHTML : '').join('\n')
}

// export function reactiveAttributes() {

// }

// export function reactiveChildren() {

// }


// class ReactiveNode {

// }


// class Runtime {

//   evaluate(node: VDOM.Node, props: Props): VDOM.Node {

//     return node
//   }

//   createComponent(tag: Tag, props: Props): VDOM.Node {
//     console.log('>', 'createComponent')
//     if (typeof (tag as ClassComponent).render === 'function') {
//       const component = new (tag as ClassComponent)()
//       tag = component.render.bind(component)
//     }
//     // console.log(tag)
//     // const element = (tag as FunctionComponent)(props, children)
//     // return element

//     // return new Component(tag as FunctionComponent, props, children) as Element //.element

//     // console.log(tag, props, children)
//     // return this.evaluate(createComponent(tag as FunctionComponent, props, children), props, children)
//     // console.log(element)

//     return this.evaluate((tag as FunctionComponent)(props), props)
//   }

//   createDocumentFragment(children: unknown[]): VDOM.Node {
//     console.log('>', 'createDocumentFragment')
//     return this.evaluate(document.createDocumentFragment() as VDOM.Node, {})
//   }

//   createElement(tagName: string, props: Props): VDOM.Element {
//     console.log('>', 'createElement')
//     return this.evaluate(document.createElement(tagName) as VDOM.Node, props) as VDOM.Element

//     // for (const name in props) {
//     //   const value = props[name]
//     //   if (typeof value === 'string') {
//     //     element.setAttribute(name, value)
//     //   } else {
//     //     // console.log(`prop '${name}' is ${typeof value}: ${JSON.stringify(value)}`)
//     //     console.log(`prop '${name}' is ${typeof value}:`, value)
//     //   }
//     // }
//     // return element
//   }

// }

// export const runtime = new Runtime()
