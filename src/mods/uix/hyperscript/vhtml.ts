/**
 * https://github.com/developit/vhtml
 * 
 * TODO: Child Component
 */

const emptyTags = [
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
];

// escape an attribute
const map: Record<string, string> = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' }
const esc = (str: unknown) => String(str).replace(/[&<>"']/g, (s: string) => `&${map[s]};`)
const setInnerHTMLAttr = 'dangerouslySetInnerHTML'
const DOMAttributeNames: Record<string, string> = {
  className: 'class',
  htmlFor: 'for'
};

const sanitized: Record<string, boolean> = {}

interface AttrValue {
  __html: string
}

interface Attrs {
  [x: string]: string | AttrValue | string[] | boolean | undefined
  children?: string[]
}

type FunctionComponent = (attrs: Attrs) => unknown

interface ClassComponent { 
  render: FunctionComponent 
}

type Tag = string | FunctionComponent | ClassComponent

/** Hyperscript reviver that constructs a sanitized HTML string. */
export default function h(name: Tag, attrs: Attrs) {
  const stack = []
  let s = ''
  attrs = attrs || {}
  for (let i = arguments.length; i-- > 2;) {
    stack.push(arguments[i])
  }

  // Sortof component support!
  if (typeof name === 'function') {
    attrs.children = stack.reverse()
    if (typeof name.prototype.render === 'function') {
      // deno-lint-ignore no-explicit-any
      const component = new (name as any)()
      name = component.render.bind(component) as FunctionComponent
    }
    return name(attrs)
  }

  if (name) {
    s += '<' + name
    if (attrs) for (const i in attrs) {
      if (attrs[i] !== false && attrs[i] != null && i !== setInnerHTMLAttr) {
        // s += ` ${DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i)}="${esc(attrs[i])}"`
        s += ` ${DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i)}="${attrs[i]}"`
      }
    }
    s += '>'
  }

  if (emptyTags.indexOf(name as string) === -1) {
    if (attrs[setInnerHTMLAttr]) {
      s += (attrs[setInnerHTMLAttr] as AttrValue).__html
    }
    else while (stack.length) {
      const child = stack.pop()
      if (child) {
        if (child.pop) {
          for (let i = child.length; i--;) {
            stack.push(child[i])
          }
        }
        else {
          s += sanitized[child] === true ? child : esc(child)
        }
      }
    }

    s += name ? `</${name}>` : ''
  }

  sanitized[s] = true
  return s
}
