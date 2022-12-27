// deno-lint-ignore-file no-explicit-any

export function setProperty(obj: any, path: string, value: unknown): boolean {
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  const a = path.split('.');
  let o = obj;
  while (a.length - 1) {
    const n = a.shift();
    if (n) {
      if (!(n in o)) o[n] = {};
      o = o[n];
    }
  }
  if (o[a[0]] !== value) {
    o[a[0]] = value;
    return true;
  }
  return false;
}

export function getProperty(obj: any, path: string): unknown {
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  const a = path.split('.');
  let o = obj;
  while (a.length) {
    const n = a.shift();
    if (n) {
      if (!(n in o)) return;
      o = o[n];
    }
  }
  return o;
}

export function flattenObject(obj: any, prefix = ''): any {
  if (obj === undefined || obj === null) {
    return {};
  }

  if (typeof obj !== 'object') {
    return {
      [obj]: obj,
    }
  }

  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix ? prefix + '.' : '';
    const value = obj[k];
    if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
      Object.assign(acc, flattenObject(value, pre + k));
    } else {
      acc[pre + k] = value;
    }
    return acc;
  }, {} as any);
}

export function flattenObjectKeys(obj: any): string[] {
  return Object.keys(flattenObject(obj));
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