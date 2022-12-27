// type JSONValue =
//   | string
//   | number
//   | boolean
//   | { [x: string]: JSONValue }
//   | Array<JSONValue>;

// interface JSONObject {
//   [x: string]: JSONValue;
// }

// export interface Object {
//   [name: string]: unknown;
// }

// type Primitive = number
//   | bigint
//   | string
//   | boolean
//   | null
//   | undefined
//   | symbol;

export type Any = Record<string, unknown>;

export function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

// export function isPromise(value: any): boolean {
//   return value && Object.prototype.toString.call(value) === "[object Promise]"
// }

// export function isPromise(value: any) {
//   return Boolean(value && typeof value.then === "function")
// }

export function isPromise(value: unknown): boolean {
  return Promise.resolve(value) === value
  // if (Promise && Promise.resolve) {
  //   return Promise.resolve(value) == value
  // } else {
  //   throw "Promise not supported in your environment" // Most modern browsers support Promises
  // }
}

export class Mutex {

  current: Promise<void>

  constructor() {
    this.current = Promise.resolve()
  }

  async lock() {
    let release: () => void
    const next = new Promise<void>(resolve => {
      release = () => resolve()
    })

    const waiter = this.current.then(() => release)
    this.current = next
    return await waiter
  }

}

// interface Dependencies {
//   tracking: boolean
//   deps: DependenciesEntry[]
// }

// const dependencies: Dependencies = {
//   tracking: false,
//   deps: []
// }

// class Dependencies {
//   tracking = false
//   deps: DependenciesEntry[] = []
//   readonly mutex = new Mutex()

//   async track(callback: () => void): Promise<void> {
//     console.log('lock')
//     const unlock = await this.mutex.lock()
//     try {
//       this.tracking = true
//       try {
//         callback()
//       } finally {
//         this.tracking = false
//       }
//     } finally {
//       unlock()
//       console.log('unlock')
//     }
//   }
// }