// deno-lint-ignore-file no-explicit-any

import { flattenObjectKeys, getProperty, setProperty } from './object-utils.ts';

interface OnChangeEvent<T = any> {
  key: string;
  value: T;
}

type OnChange<T> = (event: OnChangeEvent<T>) => void;

interface Subscribers<T> {
  [key: string]: OnChange<T>[];
}

const PARTIAL_READ_SIGNATURE = '<:R:>';
const PARTIAL_WRITE_SIGNATURE = '<:W:>';

interface PartialReadOperation {
  [PARTIAL_READ_SIGNATURE]: string;
  query: any;
}

interface PartialWriteOperation {
  [PARTIAL_WRITE_SIGNATURE]: string;
  value: any;
}

export function $get<T = unknown>(obj: T): PartialReadOperation {
  return {
    [PARTIAL_READ_SIGNATURE]: PARTIAL_READ_SIGNATURE,
    query: typeof obj !== 'object' || obj === null ? { [obj as any]: obj } : obj,
  }
}

export function $set<T = any>(obj: T): PartialWriteOperation {
  return {
    [PARTIAL_WRITE_SIGNATURE]: PARTIAL_WRITE_SIGNATURE,
    value: typeof obj !== 'object' || obj === null ? { [obj as any]: obj } : obj,
  }
}

export function reactive<T = any>(value?: T) {

  const subscribers: Subscribers<T> = {};

  function emit(entries: [string, any][]): void {
    // console.log('entries', JSON.stringify(entries));

    for (const [key, value] of entries) {
      const listeners = subscribers[key];
      if (listeners) {
        for (const onChange of listeners) {
          onChange({
            key,
            value,
          })
        }
      }
    }
  }

  function observable(arg?: any | PartialReadOperation | PartialWriteOperation): any {
    if (!arg) {
      // read all value
      return value;
    }

    // if (typeof arg !== 'object') {
    //   arg = { [arg]: arg };
    // }

    if (arg[PARTIAL_READ_SIGNATURE] === PARTIAL_READ_SIGNATURE) {
      // read partial  
      // console.log('partial read');
      const keys = flattenObjectKeys((arg as PartialReadOperation).query);

      return keys.reduce((result, key) => {
        setProperty(result, key, getProperty(value, key));
        return result;
      }, {});

    } else if (arg[PARTIAL_WRITE_SIGNATURE] === PARTIAL_WRITE_SIGNATURE) {
      // write partial
      // console.log('partial write');

      const ref = (arg as PartialWriteOperation).value;
      const keys = flattenObjectKeys(ref);

      const entries: [string, any][] = [];
      for (const key of keys) {
        const val = getProperty(ref, key);
        if (setProperty(value, key, val)) {
          entries.push([key, val]);
        }
      }

      emit(entries);
    } else {
      // overwrite
      if (value !== arg) {
        value = arg;
        emit([['*', value]]);
      }
    }

  }

  observable.subscribe = (...args: any[]) => {
    const keys = args.length === 1 ? ['*'] : flattenObjectKeys(args[0]);
    const onChange = args.length === 1 ? args[0] : args[1];

    if (typeof onChange !== 'function') {
      throw new Error(`Subscriber handler must be a function: ${typeof onChange}`);
    }

    for (const key of keys) {
      let listeners = subscribers[key];
      if (!listeners) {
        listeners = [];
        subscribers[key] = listeners;
      }
      listeners.push(onChange);
    }

    return () => {
      for (const key of keys) {
        subscribers[key] = subscribers[key].filter(eventHandler => eventHandler !== onChange);
        if (subscribers[key].length === 0) {
          delete subscribers[key];
        }
      }
    }
  }

  return observable;
}

const config = reactive({
  id: 10,
  name: 'reactive',
  data: {
    key: 'id',
    password: '1234'
  }
});


console.log('config', config);

const unsubscribe1 = config.subscribe(({ key, value }: OnChangeEvent) => {
  console.log('subscribe1', 'changed', key, JSON.stringify(value));
})

const unsubscribe2 = config.subscribe({ id: 1, name: 1, data: { password: 1 } }, ({ key, value }: OnChangeEvent) => {
  console.log('subscribe2', 'changed', key, JSON.stringify(value));
})

config($set({
  // name: new Date().toISOString()
  name: 'reactive'
}));

let value = config();

console.log('all value', value);


value = config($get({
  // name: 1,
  data: {
    // key: 1,
    password: 1,
  }
}));

console.log('some value', value);

console.log('all value', config());

config($set(1000));
config($set('abc'));

console.log('all value', config());

config('OVERRIDE');

console.log('all value', config());

unsubscribe1();
unsubscribe2();

// console.log(config.subscribe);



// function div(attrs: any) {

// }


// class main {


// div({

// })

// }

// function render(component: any) {

// }

// render(
//   div({

//   })
// );