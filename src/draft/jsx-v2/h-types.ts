/**
 * H Types
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { Element } from './dom-types.ts'

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       [elemName: string]: unknown;
//     }
//     interface ElementClass {
//       render: unknown;
//     }
//   }
// }

// export interface Attrs {
//   [name: string]: unknown
//   children?: unknown[]
// }

export type Attrs = Record<string, unknown>

// export type FunctionComponent = (attrs: Attrs, children: unknown[]) => Element

// export interface Properties {
//   attrs: Attrs
//   // props: Record<string, unknown>
//   children?: unknown[]
// }

// export type FunctionComponent = (props: { attrs: Attrs, children: unknown[] }) => Element
export type FunctionComponent = (attrs: Attrs, children: unknown[]) => Element

// export type FunctionComponent = (props: Properties, children: unknown[]) => Element
// export type FunctionComponent = (renderArgs: RenderArgs) => Element
// export type FunctionComponent = (renderArgs: RenderArgs, ...args: unknown[]) => Element
// export type FunctionComponent = (attrs: Attrs, children: unknown[]) => Element
// export type FunctionComponent = (args: unknown) => Element


// type Constructor<T> = {
//   new(): T
//   render: FunctionComponent;
// }

// export type ClassComponent = Constructor<{
//   render: FunctionComponent
// }>

export type ClassComponent = {
  new(): ClassComponent
  render: FunctionComponent
}

export type Tag = string | FunctionComponent | ClassComponent

export type JSX = (tag: Tag, props: Attrs, ...children: unknown[]) => unknown
