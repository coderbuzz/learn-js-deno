// deno-lint-ignore-file no-explicit-any
import './computed.ts';

import { isObject } from './types.ts';
import { flattenObjectKeys, getProperty, setProperty } from './object-utils.ts';

interface OnChange<T = any> {
  key: string;
  value: T;
}

interface Subscribers<T> {
  [key: string]: ((event: OnChange<T>) => void)[];
}

interface Observable<T> {
  (value?: any): T;
  // $: '*'; // Reactive Signature
  get(query: any): T;
  set(value: any): void;
  subscribe(...args: any[]): () => void;
}

interface Reactive {
  $: '*'; // Reactive Signature
}

type Computed = () => any;

export function reactive<T = any>(value?: any): Observable<T> {

  const subscribers: Subscribers<T> = {};
  const computed = typeof value === 'function' && value as Computed;
  const deps = {

  }

  // if (computed) {
  //   value = undefined;
  // }

  console.log('computed', computed);

  const set = (newValue: any) => {
    if (newValue !== value) {
      value = newValue;
      emit([['*', value]]);
    }
  }

  const get = () => {
    if (computed) {
      value = computed();
    }
    return value;
  }

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


  if (computed) {
    // todo: track dependencies
    // value = 

    get();
  }
  

  function observable(newValue?: any): any {
    if (newValue === undefined) {
      // get value
      return get();
    }

    if (computed) {
      throw new TypeError('Cannot assign to read only property.');
    }

    set(newValue);
  }


  Object.defineProperty(observable, '$', {
    value: '*',
    writable: false,
  });


  Object.defineProperty(observable, 'get', {
    value: (query: any): any => {

      get();

      if (query === undefined) {
        return value;
      }

      if (!isObject(query)) {
        return getProperty(value, query);
      }

      const keys = flattenObjectKeys(query);
      return keys.reduce((result, key) => {
        setProperty(result, key, getProperty(value, key));
        return result;
      }, {});
    }
  });


  Object.defineProperty(observable, 'set', {
    value: (newValue: any): void => {
      if (computed) {
        throw new TypeError('Cannot assign to read only property.');
      }

      if (!isObject(newValue)) {
        // value = newValue;
        // return emit([['*', value]]);
        return set(newValue);
      }

      const keys = flattenObjectKeys(newValue);
      const entries: [string, any][] = [];
      for (const key of keys) {
        const sourceValue = getProperty(newValue, key);
        if (setProperty(value, key, sourceValue)) {
          entries.push([key, sourceValue]);
        }
      }
      emit(entries);
    }
  });

  Object.defineProperty(observable, 'subscribe', {
    value: (...args: any[]) => {
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
  });

  return observable as Observable<T>;
}


// ----------------------------------------------------------------


// const firstName = reactive('Indra');
// const lastName = reactive('Gunawan');

// // computed
// // todo: track dependencies
// const fullName = reactive(() => firstName() + ' ' + lastName());

// fullName.subscribe(({ key, value }: OnChange) => {
//   console.log('fullName', 'changed', key, value);
// })

// console.log(fullName());

// firstName('Mr.');


// fullName('Set Computed');

// console.log(firstName.$);
// firstName.$ = '1';

// ----------------------------------------------------------------

// const config = reactive({
//   id: 10,
//   name: 'reactive',
//   data: {
//     key: 'id',
//     password: '1234'
//   }
// });


// console.log('config', config);


// const unsubscribe1 = config.subscribe(({ key, value }: OnChangeEvent) => {
//   console.log('subscribe1', 'changed', key, JSON.stringify(value));
// })

// const unsubscribe2 = config.subscribe({ id: 1, name: 1, data: { password: 1 } }, ({ key, value }: OnChangeEvent) => {
//   console.log('subscribe2', 'changed', key, JSON.stringify(value));
// })

// config.set({
//   // name: new Date().toISOString()
//   name: 'reactive'
// });

// let value = config();

// console.log('all value', value);


// value = config.get({
//   // name: 1,
//   data: {
//     // key: 1,
//     password: 1,
//   }
// });

// console.log('some value', value);

// console.log('all value', config());

// config.set(1000);
// config.set('abc');

// console.log('all value', config());

// config('OVERRIDE');

// console.log('all value', config());

// unsubscribe1();
// unsubscribe2();

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