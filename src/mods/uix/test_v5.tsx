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


class Li {

  constructor(props: Props) {
    console.log('Li created', props)
  }

  render() {
    console.log('Li evaluated')

    const items = $(['A', 'B', 'C'], 'li-items')

    setTimeout(() => {
      // items(['Z'])
      // items.set({ 1: 'Z' })
    }, 500)

    return () => items().map(item => <li class="box">{item}</li>)
    // return items().map(item => <li class="box">{item}</li>)
  }

}


// function Ul() {
//   return <ul style="width: 100%;"><Li /></ul>
// }

function Ul() {
  return <ul style="width: 100%;"><Li /></ul>
}

function Debug() {
  const world = 'World'
  const num = 1000
  const items = $(['A'], 'ul-items')

  setTimeout(() => {
    // items(['Z'])
    // items.set({ 0: 'Z' })
  }, 500)

  return () => <>
    Hello {world} {num}
    <>
      {() => items().map(item => <Ul abc={item} />)}
    </>
    <>
      {/* empty fragment */}
    </>
  </>
}

interface TimeProps {
  caption: string
  children?: unknown
}

function Clock() {
  return <div>Clock</div>
}

function Time({ caption, children }: TimeProps) {
  console.log('RERENDER', 'Time')

  const time = $(new Date().toLocaleString('sv').split(' ')[1], 'time')

  const num = $(1000, 'num')
  // setInterval(() => {
  //   time(new Date().toLocaleString('sv').split(' ')[1])
  // }, 1000)

  setTimeout(() => {
    // time(new Date().toLocaleString('sv').split(' ')[1])
    // num(6000)
  }, 1000)


  // return () => <pre>{caption} {time}</pre>
  // return <pre>{caption} {time()}</pre>

  // return () => <pre>{caption} {num} {true} {time} {children} <Clock /></pre>
  return <pre>{caption} {num} {true} {time} {children} <Clock /></pre>
}

// const barJSX = <>
//   <Debug />
//   <Time />
// </>

interface TimesProps {
  times: Reactive<string[]>
  timesValue: string[]
  children?: unknown
}

function Times({ times, timesValue, children }: TimesProps) {
  // const times = $(['A', 'B', 'C'], 'times')

  console.log('RERENDER', 'Times')

  // console.log(times, children)

  setTimeout(() => {
    // times(['TIMES Z'])
    // times.set({ 0: 'Z' })
  }, 1000)

  return () => times().map(caption => <Time caption={caption}>{timesValue} {children}</Time>)
  // return times().map(caption => <Time caption={caption} >{children}</Time>)
}

// const times = $(['A', 'B', 'C'], 'times')
const times = $(['TIMES'], 'times')

const jktTimes = $(['J', 'K', 'T'], 'jktTimes')
// const xTimes = $(() => jktTimes(), 'xTimes')
// const jakartaTimes = $(() => jktTimes(), 'jakartaTimes')

const jakartaTimes = $(() => jktTimes().join(' '), 'jakartaTimes')

setTimeout(() => {
  // times(['BZA'])
  // jktTimes(['JAKARTA'])
  // times.set({ 0: 'Z' })
}, 2000)

// const barJSX = <Times times={times}>{jakartaTimes().join(' ')}</Times>
// const barJSX = <Times times={times} timesValue={times()}>{jakartaTimes}</Times>
// const barJSX = <Time caption={times().join(' ')} />
// const barJSX = <Time caption={'OK'}>{times().join(' ')}</Time>

const time = $(new Date().toLocaleString('sv').split(' ')[1], 'time')

const barJSX = (
  <div>

  </div>
)

log('\n---JSX---\n')

console.dir(barJSX, { depth: 20 })
// log(barJSX)

invalidate(() => {
  console.dir(barJSX, { depth: 20 })
})


// console.log(render(barJSX))