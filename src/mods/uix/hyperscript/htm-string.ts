/**
 * Note: Currently does not support Component
 * 
 * http://tc39wiki.calculist.org/es6/template-strings/
 * https://stackoverflow.com/questions/30003353/can-es6-template-literals-be-substituted-at-runtime-or-reused
 * https://stackoverflow.com/questions/14906492/how-can-whitespace-be-trimmed-from-a-regex-capture-group
 */


type TemplateContext = Record<string, unknown>
type Prepared = (values: TemplateContext) => string

export function prepare(strings: string): Prepared {
  const exp = new RegExp(/\${ *([^\]]*?) *\}/g)

  return (context: TemplateContext): string => {
    return strings.replace(exp, (_, name) => {
      const value = context[name]
      return (typeof value === 'function' ? value() : value) as string
    })
  }
}

// const prepared = prepare('<div class="${  foo}" id="${id  }"></div>')
// console.log(prepared({ foo: 'Bar', id: () => 'ID' }))

export default function htm(strings: string, context: TemplateContext): string {
  return strings.replace(/\${ *([^\]]*?) *\}/g, (_, name) => {
    const value = context[name]
    return (typeof value === 'function' ? value() : value) as string
  })
}

// const str = htm('<div class="${foo}" id="${id}"></div>', { foo: 'Bar', id: () => 'ID' })
// console.log('htm', str)
