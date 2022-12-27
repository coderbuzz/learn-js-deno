import { NotifyEvent, Context } from './types.ts'
import { $ } from './mod.ts'

const firstName = $('Indra', 'firstName')
const lastName = $('Gunawan', 'lastName')
const time = $(`time: ${new Date().toLocaleString('sv').split(' ')[1]}`, 'time')

const oddValue = $('Odd!', 'oddValue')
const evenValue = $('Even!', 'evenValue')
const isOdd = $(true, 'isOdd')

// computed
const fullName = $(() => firstName() + ' ' + lastName() + firstName(), 'fullName')
const fullNameWithTime = $(() => fullName() + ', ' + time(), 'fullNameWithTime')
const fullNameWithTimeAndOddEven = $(() => fullNameWithTime() + `, isOdd: ${isOdd() ? oddValue() : evenValue()}`, 'fullNameWithTimeAndOddEven')

// test computed async

const loading = $(false, 'loading')
const url = $('https://www.google.com', 'url')

const loadAsyncData = $(() => {
  loading(true)
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`${url()} ${new Date().toLocaleString('sv')}`)
      loading(false)
    }, 5000)
  })
}, 'loadAsyncData', [url])

const stranger1 = $(1, 'stranger1')
const stranger2 = $(2, 'stranger2')
const stranger3 = $(3, 'stranger3')

async function logWatch({ key, value, name }: NotifyEvent<unknown>): Promise<void> {
  stranger1()
  stranger2()
  stranger3()
  console.log('🚀', ['watch', name], ['key', key], [await value])
}
async function logContext(context: unknown): Promise<void> {
  const ctx = context as Context<unknown>
  console.log('👉', [ctx.name], '=', [await ctx()])
}

fullNameWithTime.watch(logWatch)
fullNameWithTimeAndOddEven.watch(logWatch)

loading.watch(logWatch)
url.watch(logWatch)
loadAsyncData.watch(logWatch)

function logs() {
  // console.log('\033[2J')
  console.log()
  // firstName('Mr. ' + Math.random()) // set dependencies firstName state
  // time(`time: ${new Date().toLocaleString('sv').split(' ')[1]}`) // set dependencies time state
  isOdd(!isOdd())

  // url('https://' + Math.random())
  // loading(!loading())

  logContext(firstName)
  logContext(lastName)
  logContext(time)
  logContext(isOdd)
  logContext(fullName)
  logContext(fullNameWithTime)
  logContext(fullNameWithTimeAndOddEven)
  logContext(loading)
  logContext(url)
  logContext(loadAsyncData)
}

logs()
setInterval(logs, 2000)

// ----------------------------------------------------------------

// const fullName = $(() => {
//   // console.log('fullName', 'calculated')
//   return firstName() + ' ' + lastName()
// }, 'fullName')

// const fullNameWithTime = $(() => {
//   // console.log('fullNameWithTime', 'calculated')
//   return fullName() + ' ' + time()
// }, 'fullNameWithTime')


// ----------------------------------------------------------------

// const state = $({
//   id: 100,
//   name: 'Samsung',
//   address: {
//     primary: 'Depok',
//     secondary: 'Jember'
//   }
// })

// console.log(state.get('name'))
// console.log(state.get({ name: 1 }))

// console.log(state.get('address.primary'))
// console.log(state.get({ address: 1 }))
// console.log(state.get({ address: { primary: 1 } }))

// state.set('name')

// console.log(state.get('name'))
// console.log(state.get({ name: 1 }))

/*

function Style() {

  const style = $({
    color: 'red',
    backgroundColor: 'white'
  })

  style.watch({ color: 1, backgroundColor: 1 }, ({ key, value }) => {
    console.log('style', key, value)
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
        Hello World
      </pre>
    </div>
  )
}

*/