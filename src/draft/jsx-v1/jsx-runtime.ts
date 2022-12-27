// https://www.typescriptlang.org/docs/handbook/jsx.html

/*
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
    interface ElementClass {
      render: unknown;
    }
  }
}
*/


type Render = (props: unknown) => H

interface Component {
  render: Render
}

type Type = string | Render | Component

interface Properties {
  children: unknown
}

interface H {
  type: Type
  props: unknown
  children: unknown
}

// export function h(type: string, props: unknown, ...children: unknown[]): H {
//   // const children = args.length ? [].concat(...args) : null
//   // const children = args.length ? args : null
//   // return { type, props, children }
//   return { type, props, children }
// }

// export function Fragment(type: string, props: unknown, ...children: unknown[]): H {
//   return { type, props, children }
// }


export function jsx(type: string, props: unknown, ...args: unknown[]): H {
  const children = (props as Properties).children || args
  delete (props as Properties).children
  return { type, props, children }
}

