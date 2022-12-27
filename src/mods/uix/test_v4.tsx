import './jsx/ssr.ts'

import { jsx } from './mod.ts'
import htm from './jsx/hsx.ts'
import { onMount, onDestroy } from './jsx/lifecycle.ts'
import { $ } from '../reactor/mod.ts'
import { List } from './jsx/list.tsx'

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

interface DataProps {
  name: string
}

const data = [
  { name: 'Indra' },
  { name: 'Gunawan' },
]

function Case1() {
  return (
    <List items={data} filter={(item: DataProps) => item.name === 'Indra'}>
      <Child name="BEFORE" />
      {(item: ChildProps) => <Child {...item} />}
      <Child name="AFTER" />
      {data.map((item: DataProps) => <div>name: {item.name}</div>)}
      ...
    </List>
  )
}

function ListComponent() {

  const list = $(['A', 'B', 'C'], 'list')

  // console.log(list())

  // list.watch('*', ({ key, value, name }) => {
  //   console.log('watch', key, value, name)
  // })

  setTimeout(() => {
    // list.set({ 1: 'JAJA' })
    list(['DCA'])
    // console.log(list())
  }, 500)

  // return <div>{list().map((name: string) => <div>{name}</div>)}</div>
  // return () => <div>{list().map((name: string) => <div>{name}</div>)}</div>

  return () => (
    <div>
      <List items={list()}>
        ...PREFIX
        {/* <div> */}
        {() => <div>{list().map((name: string) => <ul>{name}</ul>)}</div>}
        {/* </div> */}
        {(name: string) => <li>{name}</li>}
        ...SUFIX
      </List>

    </div>
  )
}

function Debug() {
  return <ListComponent />
  // return <Case1 />
  // return data.map((item: DataProps) => <div>{item.name}</div>)
  // return <>{data.map((item: DataProps) => item.name)}</>
  // return data.map((item: DataProps) => item.name)
}


const barJSX = <Debug />

log('\n---BAR JSX---\n')
// console.dir(barJSX, { depth: 10})

log(barJSX)

// ----------------------------------------------------------------

