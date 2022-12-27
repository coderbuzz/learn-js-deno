import './jsx/ssr.ts'

import { jsx } from './mod.ts'
import htm from './jsx/hsx.ts'
import { onMount, onDestroy } from './jsx/lifecycle.ts'
import { $ } from '../reactor/mod.ts'
import { Attrs } from './jsx/h-types.ts'
import { List } from './jsx/list.tsx'

// console.log("\033[2J\033[1;1H")
console.log('\x1Bc');
// console.clear()

const html = htm(jsx)

function logString(value: unknown) {
  console.log(`${value}\n`)
}

const log = logString


class Flipflop {

  render() {
    const flip = $(true, 'flip')
    // const flipflop = $(() => flip() ? 'red' : 'white', 'flipflop')

    const color = $(() => flip() ? 'red' : 'white', 'color')

    flip.watch(() => {
      console.log('flip', flip())
    })

    setInterval(() => {
      flip(!flip())
    }, 1000)

    return (
      <div style={{ color: color() }}>
        <div>{flip()}</div>
      </div>
    )
  }
}

function Timer() {
  const timer = $('Init Timer... ', 'timer')

  timer.watch(() => {
    console.log('timer', timer())
  })

  setInterval(() => {
    // console.log('tick')
    timer(new Date().toLocaleString('sv').split(' ')[1])
  }, 1000)


  return (
    <div>
      {timer()}
    </div>
  )
}

function Style() {

  const style = $({
    color: 'red',
    backgroundColor: 'white',
    width: '100%',
  }, 'style')

  // const color = style.$('color')

  // const colorAndWidth = style.$({
  //   color: 1,
  //   width: 1
  // })

  const flipColor = $((value) => value === 'red' ? style.get('color') : style.get('backgroundColor'), 'flipColor')

  style.watch({ color: 1, backgroundColor: 1 }, ({ key, value }) => {
    console.log('style', key, value)
  })

  flipColor.watch(({ value }) => {
    console.log('flipColor', value)
  })

  setInterval(() => {
    // console.log('tick')
    style.set({
      color: style.get('backgroundColor') as string,
      backgroundColor: style.get('color') as string
    })
  }, 1000)

  return (
    <div style={{
      color: style.get('color'),
      backgroundColor: style.get('backgroundColor')
    }}>
      <pre style={style()}>
        Flip Color: {flipColor()}
      </pre>
      <pre style={style.get({ color: 1 })}>
        Hello World
      </pre>
    </div>
  )
}


// function MyForm() {
//   return html`
//     <form action="/action_page.php">
//       <label for="fname">First name:</label>
//       <input type="text" id="fname" name="fname" /><br /><br />
//       <label for="lname">Last name:</label>
//       <input type="text" id="lname" name="lname" /><br /><br />
//       <input type="submit" value="Submit" />
//     </form>`
// }

// ----------------------------------------------------------------


function Debug() {
  const h1 = $('h1', 'h1')
  const h2 = $('h2', 'h2')
  const h3 = $('h3', 'h3')
  const h4 = $('h4', 'h4')
  const color = $('white', 'color')
  const backgroundColor = $(() => color() === 'white' ? 'black' : 'white', 'backgroundColor')
  const time = $(() => new Date().toLocaleString('sv').split(' ')[1], 'time')

  const classes = {
    hide: $(() => color() === 'white', 'hide'),
  }

  onMount(() => {
    console.log('onMounted')
  })

  onDestroy(() => {
    console.log('onDestroyed')
  })

  return <>
    <div class={classes} style={{ color: $(() => color + ' ' + time + ' ' + color(), 'style'), backgroundColor: backgroundColor }} id={h1}>
      <h1>{h1}</h1>
      <h2>{h2}</h2>
      <h3>
        {h3}
        <h4>{h4}</h4>
      </h3>
    </div>
  </>
}

// const barJSX = <>
{/* <Debug /> */ }
{/* <Flipflop /> */ }
{/* <Timer /> */ }
{/* <Style /> */ }
// </>

// const barJSX = <Debug />

interface ChildProps {
  name: string
}

function Child(props: ChildProps) {
  return <child>{props.name}</child>
}

interface ParentProps {
  name: string
  age?: number
}

function Parent(props: ParentProps, children: Element[]): Element {
  // console.log(props, children)
  return <parent>
    Parent
    {children}
  </parent>
}


// const data = ['Indra', 'Gunawan']
const data = [
  { name: 'Indra' },
  { name: 'Gunawan' },
]

function Case1() {
  return (
    <List items={data}>
      <Child name="BEFORE" />
      {(item: ChildProps) => <Child {...item} />}
      <Child name="AFTER" />
      ...
    </List>
  )
}


// function Case1() {
//   return (
//     <Parent name="Indra">
//       <Child />
//       <Child />
//     </Parent>
//   )
// }

const barJSX = <Case1 />

log('---BAR JSX---')
// console.dir(barJSX, { depth: 10})
log(barJSX)

// ----------------------------------------------------------------

// const barHSX = html`<>
//   <${Flipflop} />
//   <${Timer} />
//   <${Style} />
// </>`

// log('---BAR HSX---')
// log(barHSX)

// // ----------------------------------------------------------------

// console.log('RESULT:', `${barJSX}` === `${barHSX}`)
