import { jsx } from './mod.ts'
import example from './example.tsx'
import template from './hyperscript/htm-string.ts'
import htm from './jsx/hsx.ts'
import vhtml from './hyperscript/vhtml.ts'

// const foo = jsx('div', { id: 'foo', style: { color: "black" } }, 'Hello!')
// console.log(foo)

function logString(value: unknown) {
  console.log(`${value}\n`)
}

// const log = console.log.bind(console)
const log = logString

class MySibling {
  render() {
    return (
      <>
        <a href="https://www.w3schools.com">Visit W3Schools.com!</a>
        <div>MySibling</div>
      </>
    )

  }
}

function MyChild() {
  const child = 'MyChild!';
  // return <div>{child}</div>
  return (
    <a>
      <div>
        <br />
        <input type="text" id="fname" name="fname" /><br /><br />
        <div>{child}</div>
      </div>
    </a>
  )

}

const bar = <div id="bar">
  Child of Bar
  <MyChild />
  <MySibling />
</div>


console.dir(bar, { depth: 10 })

log('---BAR---')
log(bar)


const foobar = <div>Foo Bar</div>

log(foobar)

// log(example)
// const template = '<div class="${foo}"></div>'

// const ctx = {
//   foo: 'bar',
// }

// const tagged = template.call(ctx, ctx)
// log(tagged)


// const str = template('<div class="${foo}" id="${id}"> <Child id="child" />  </div>', { foo: 'Bar', id: () => 'ID' })
// log('template', str)

log('----------------------------------------------------------------\n')


// function h(type: unknown, props: Record<string, unknown>, ...children: unknown[]) {
//   return { type, props, children }
// }

// const html = htm(h)
// const html = htm(vhtml)
const html = htm(jsx)


function Magic() {
  return html`<div>Magic</div>`
}

const Hello = 'World'
// const Hello = () => html`<div>Hello</div>`

log(html`<a href="/">Hello! <${Magic} /> <${Magic} hello=World/></a>`);
log(html`<a href="/">Hello! <${Magic} hello=World/></a>`);
log(html`<a href="/">Hello! <${Hello} hello=World/></a>`);
log(html`<a href="/">Hello! <${Hello} hello=World/></a>`);

log(html`<div><${Magic}/></div>`);

interface MyComponentArgs {
  id: string
  number: string
  // children: unknown
}

class MyComponent {
  render(args: MyComponentArgs, ...children: unknown[]) {
    console.log('args', args, children)
    return html`<div id="${args.id}" number="${args.number}">My Component ${children}</div>`
  }
}


log(html`<div>Cached <${MyComponent} id="myComponent" number=1000>My Children<//>Google</div>`);

// console.log(Function.prototype.toString.call(MySibling))

