import { Tag, Props, ClassComponent, FunctionComponent } from './h-types.ts'
import * as VDOM from './dom-types.ts'
import { Context } from '../../reactor/types.ts'
import { $ } from '../../reactor/mod.ts'

type Computed = () => unknown

function toArray(items: unknown): Array<unknown> {
  /** 
   * normalize items as array
  */
  if (items) {
    if (!Array.isArray(items)) {
      return [items]
    } else {
      // remove undefined
      return items.filter(item => item)
    }
  } else {
    return []
  }
}

export class VNode {

  #parent?: VNode
  element?: Node
  props: Props

  constructor(
    tag: Tag,
    props: Props,
    value?: unknown
  ) {
    // console.log(['tag', tag])
    this.props = props

    /**
     * tag: '' = Text node
     * tag: string = Element
     * tag: FunctionComponent | ClassComponent = observable
     */

    if (tag === '') {
      this.element = document.createTextNode(String(value))
    } else if (typeof tag === 'string') {
      this.element = document.createElement(tag)
    }

    this.setup(tag)
  }

  setup(tag: Tag) {
    const props = this.props

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
        // props.children = this.observe(this, () => value, tag.name)
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

    // this.patch(this, props.children)

    this.observeChildren(this, toArray(props.children))
  }

  get parent(): VNode | undefined{
    return this.#parent
  }

  set parent(parent: VNode | undefined) {
    this.#parent = parent
  }

  patch(parent: VNode, children: Array<VNode>) {

    // if (children) {
    //   this.observeChildren(parent, toArray(children))
    // }

    // TODO: Diff Patch
    // console.log('PATCH', children)
    // console.dir(children, { depth: 20 })
    parent.props.children = children
  }

  observe(parent: VNode, computed: Computed, name: string): unknown {
    // console.log('observable ---------------')
    const observable = $(computed, name)
    // console.log(computed.name, typeof (computed as Context<unknown>).deps)

    // const observable = typeof (computed as Context<unknown>).watch === 'function' ? computed as Context<unknown> : $(computed, name || '')
    // console.log(observable, typeof (computed as Context<unknown>).deps)

    if (observable.deps.length > 0) {
      console.log(['observing >'], observable.name)

      observable.watch('*', ({ name, value }) => {
        console.log('computed', [name], 'changed!', [value])

        // this.patch(parent, value)
        this.observeChildren(parent, toArray(value))
      })
    }

    // props.children = observable()
    return observable()
  }

  observeChildren(parent: VNode, children: Array<unknown>) {
    // console.log(['child >'], children)

    /**
     * Transform unknown children to VNode
     * Child: VNode | string | number | observable function (Context) | plain function
     * - if a child is plain function we need wrap it to observable function to detect reactive dependencies
     * 
     * children could be Child | Array<Child>
     * - if a child is array we need to flat them
     */

    const convertChild = (children: Array<unknown>, normalizedChildren: Array<VNode>): Array<VNode> => {

      for (const child of children) {

        if (Array.isArray(child)) {
          convertChild(child, normalizedChildren)
        } else if (child instanceof VNode) {
          normalizedChildren.push(child)
        } else if (typeof child === 'function') {
          // console.log((parent.element as Element).tagName)
          // console.log(parent)
          const children = this.observe(parent, child as Computed, parent.element ? (parent.element as Element).tagName : '<>')
          // console.log('>>>>', children)
          convertChild(toArray(children), normalizedChildren)

          // console.log('normalizedChildren', normalizedChildren)
        } else {
          // console.log('child', child)
          normalizedChildren.push(new VNode('', {}, child))
        }
      }

      return normalizedChildren
    }

    const normalizedChildren: Array<VNode> = convertChild(children, [])

    // todo patch diff normalizedChildren
    this.patch(parent, normalizedChildren)

    // parent.props.children = normalizedChildren
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
