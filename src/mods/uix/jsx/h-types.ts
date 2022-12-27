/**
 * H Types
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

// import * as VDOM from './dom-types.ts'

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

export interface Props {
  [name: string]: unknown
  children?: unknown
}

export type FunctionComponent = (props: Props) => unknown

export type ClassComponent = {
  new(props?: Props): ClassComponent

  readonly props: Props
  render: FunctionComponent
}

export type Tag = string | FunctionComponent | ClassComponent

export type Computed<T = unknown> = () => T

// export type Props = Record<string, unknown>

export interface HResult {
  tag: Tag
  props: Props
}

// export interface VNode {
//   tag: Tag
//   props: Props
//   parent?: VNode
//   // children: unknown
//   // component?: FunctionComponent | ClassComponent
// }

export type JSX = (tag: Tag, props: Props) => unknown
// // export type JSX = (...args: unknown[]) => unknown


// export interface Props {
//   [name: string]: unknown
//   children?: Array<unknown> 
// }

// export type FunctionComponent = (props: Props) => VDOM.Element

// export type ClassComponent = {
//   new(): ClassComponent
//   render: FunctionComponent
// }

// export type Tag = string | FunctionComponent | ClassComponent

// export type JSX = (tag: Tag, props: Props, ...children: unknown[]) => unknown
// // export type JSX = (...args: unknown[]) => unknown