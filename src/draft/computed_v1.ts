// deno-lint-ignore-file no-explicit-any

interface Context {
  value: unknown
}

type Compute = () => unknown | Promise<unknown>

class Computed {

  context: Context
  compute: Compute

  constructor(context: Context, compute: Compute) {
    this.context = context
    this.compute = compute
    context.value = compute()
  }

}


class Observable {

  context: Context = {
    value: undefined
  }

  computed?: Computed

  constructor(value: any) {
    if (typeof value === 'function') {
      this.computed = new Computed(this.context, value as Compute)
    } else {
      this.context.value = value
    }
  }

  // get() {
  //   return this.context.value
  // }

  // set(value: any) {
  //   this.context.value = value
  // }

  observable() {
    return (value?: any) => {
      if (!value) {
        return this.context.value
      }
      this.context.value = value
    }
  }

}


export function $(value: any) {
  return new Observable(value).observable()
}

const firstName = $('Indra')
const lastName = $('Gunawan')
const time = $(new Date().toLocaleString('sv'))

const fullName = $(() => firstName() + ' ' + lastName() + ' ' + time())

console.log(fullName())

setInterval(() => {
  time(new Date().toLocaleString('sv'))
}, 1000)