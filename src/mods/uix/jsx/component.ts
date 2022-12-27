import { Tag, Attrs, ClassComponent, FunctionComponent } from './h-types.ts'
import { LifecycleTarget, LifecycleCallback, lifecycle } from './lifecycle.ts'
import { Element } from './dom-types.ts'

// const addedToParentEvent = new CustomEvent('addedToParentEvent', { detail: elem.dataset.time });
export function createComponent(render: FunctionComponent, attrs: Attrs, children: unknown[]): Element {

  class Component extends HTMLElement implements LifecycleTarget {

    readonly onMount: LifecycleCallback[] = []
    readonly onDestroy: LifecycleCallback[] = []

    constructor() {
      // super('component')

      super()

      this.tagName = '$'

      // (this as unknown as TagName).setTagName('component')

      lifecycle.target = this
      try {
        const shadow = this.attachShadow({ mode: 'open' });

        // if (!(node instanceof Node)) {
        //   node = new Text(node)
        // }
        // shadow.appendChild(render(attrs, children) as unknown as Node)
        // shadow.append(render({ attrs, children }) as unknown as Node)
        shadow.append(render(attrs, children) as unknown as Node)

        // this.append(render(attrs, children) as unknown as Node)
        // this.firstChild
        // this.element = render(attrs, children)
      } finally {
        lifecycle.target = undefined
      }
    }

    protected notify(registry: LifecycleCallback[]) {
      for (let i = 0; i < registry.length; i++) {
        registry[i]()
      }
    }

    connectedCallback() {
      console.log(`Component ${this.tagName} element added to page.`);
      this.notify(this.onMount)
    }

    disconnectedCallback() {
      console.log('Component element removed from page.');
      this.notify(this.onDestroy)
    }

    // observe() {
    //   this.element.addEventListener('setParent', () => {
    //     const observer = new MutationObserver((mutations: MutationRecord[], _: MutationObserver) => {
    //       console.log(mutations)
    //       // for (const mutation of mutations) {
    //       //   mutation.type
    //       // }
    //     })
    //     observer.observe(this.element.parentNode as unknown as Node)
    //   })
    // }

  }

  return new Component() as Element
}


// customElements.define('component', Component)