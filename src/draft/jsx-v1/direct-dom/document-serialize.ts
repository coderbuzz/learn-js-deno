/**
 * DOM tree to HTML string serialization
 * 
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { Element, Attributes, Text } from './document.ts'

const emptyTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
])

type Line = [number, string]

export function serialize(element: Element, includeRoot: boolean): string {
  const stack: Array<Line> = []

  let level: number = includeRoot ? 0 : -1

  const serializeAttributes = (attributes: Attributes) => {
    const keys = Object.keys(attributes)
    if (keys.length > 0) {
      return ` ${keys.map(key => `${key}="${attributes[key]}"`).join(' ')}`
    } else {
      return ''
    }
  }

  const serializeElement = (element: Element) => {
    if (element.tagName) {
      stack.push([level, `<${element.tagName}${serializeAttributes(element.attributes)}>`])
    }
  }

  const serializeChildren = (element: Element) => {
    if (element.tagName) {
      level++
    }
    for (const child of element.childNodes) {
      if (child instanceof Element) {
        serializeElement(child)
        serializeChildren(child)
        if (child.tagName && !emptyTags.has(child.tagName)) {
          stack.push([level, `<${child.tagName}/>`])
        }
      } else if (child instanceof Text) {
        stack.push([level, (child as Text).data])
      }
    }
    if (element.tagName) {
      level--
    }
  }

  if (includeRoot) {
    serializeElement(element)
  }

  serializeChildren(element)

  if (includeRoot && element.tagName && !emptyTags.has(element.tagName)) {
    stack.push([level, `<${element.tagName}/>`])
  }

  const addSpaces = (line: Line): string => ' '.repeat(Math.max(line[0], 0) * 2) + line[1]

  return stack.map(line => addSpaces(line)).join('\n')
}
