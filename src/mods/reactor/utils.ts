
export type Any = Record<string, unknown>

// export function initSet(set: Set<unknown>, values: unknown[], getValue: (value: unknown) => unknown): void {
//   set.clear()
//   for (let i = 0; i < values.length; i++) {
//     // console.log(getValue(values[i]))
//     set.add(getValue(values[i]))
//   }
// }

export function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null
}

// export function isPromise(value: any): boolean {
//   return value && Object.prototype.toString.call(value) === "[object Promise]"
// }

// export function isPromise(value: any) {
//   return Boolean(value && typeof value.then === "function")
// }

export function isPromise(value: unknown): boolean {
  return Promise.resolve(value) === value
}

export function setProperty(obj: unknown, path: string, value: unknown): boolean {
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  const a = path.split('.')
  let o = obj as Any
  while (a.length - 1) {
    const n = a.shift()
    if (n) {
      if (!(n in o)) o[n] = {}
      o = o[n] as Any
    }
  }
  if (o[a[0]] !== value) {
    o[a[0]] = value
    return true
  }
  return false
}

export function getProperty(obj: unknown, path: string): unknown {
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  const a = path.split('.')
  let o = obj as Any
  while (a.length) {
    const n = a.shift()
    if (n) {
      if (!(n in o)) return
      o = o[n] as Any
    }
  }
  return o
}

export function flattenObject(obj: unknown, prefix = ''): Any {
  if (obj === undefined || obj === null) {
    return {}
  }

  if (typeof obj !== 'object') {
    return {
      [obj as string]: obj,
    }
  }

  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix ? prefix + '.' : ''
    const value = (obj as Any)[k]
    if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
      Object.assign(acc, flattenObject(value, pre + k))
    } else {
      acc[pre + k] = value
    }
    return acc
  }, {} as Any)
}

export function flattenObjectKeys(obj: unknown): string[] {
  return Object.keys(flattenObject(obj))
}

// console.log(flattenObjectKeys({
//   zonk: {},
//   value: [100, 200, { abc: 100 }],
//   nested: {
//     child1: {
//       sub1: true,
//       sub2: true
//     },
//     child2: {
//       sub: true,
//       child3: {
//         cicit: 1,
//         cucut: {
//           ok: 1000
//         }
//       }
//     }
//   }
// }));