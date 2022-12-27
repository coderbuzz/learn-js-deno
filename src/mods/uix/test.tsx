import './jsx/ssr.ts'

import { jsx, Props, invalidate } from './mod.ts'
import htm from './jsx/hsx.ts'
import { onMount, onDestroy } from './jsx/lifecycle.ts'
import { $, Reactive } from '../reactor/mod.ts'
import { List } from './jsx/list.tsx'
import { render } from './jsx/runtime.ts'

// console.log("\033[2J\033[1;1H")
console.log('\x1Bc');
// console.clear()

const html = htm(jsx)

function logString(value: unknown) {
  // console.log(value)

  if (Array.isArray(value)) {
    value.forEach((item) => console.log(`${item}`))
  } else {
    console.log(`${value}\n`)
  }
}

const log = logString


interface TimeProps {
  time: Reactive<string>
}

function Time({ time }: TimeProps) {
  console.log(['⚡️⚡️⚡️', 'RERENDER', 'Time', '⚡️⚡️⚡️'])
  return (
    <div data-time={time} >
      {time}
    </div>
  )
}


const date = $(new Date(), 'date')
const time = $(() => date().toLocaleString('sv').split(' ')[1], 'time')

setTimeout(() => {
  date(new Date())
}, 1000)

// const barJSX = <Time time={time} />

const barJSX = (
  <div id={time}>
    <Time time={time} />
  </div>
)


log('\n---JSX---\n')

console.dir(barJSX, { depth: 20 })
// log(barJSX)

invalidate(() => {
  console.dir(barJSX, { depth: 20 })
})


// console.log(render(barJSX))