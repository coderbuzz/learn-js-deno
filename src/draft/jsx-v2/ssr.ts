/**
 * Install SSR for server-side rendering
 * 
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */


import { Document as VDocument, HTMLElement as VHTMLElement } from './vdom.ts'

if (typeof globalThis.document === 'undefined') {
  globalThis.document = new VDocument() as unknown as Document

  globalThis.MutationObserver = class MutationObserver {
    disconnect(): void {

    }

    observe(target: Node, options?: MutationObserverInit): void {

    }

    takeRecords(): MutationRecord[] {
      return []
    }
  }

  globalThis.HTMLElement = (VHTMLElement as unknown) as {
    new(): HTMLElement
    prototype: HTMLElement
  }

  // globalThis.Event = class Event {
  //   readonly bubbles: boolean = false
  //   cancelBubble = false
  //   readonly cancelable: boolean = false
  //   readonly composed: boolean = false
  //   readonly currentTarget: EventTarget | null = null
  //   readonly defaultPrevented: boolean = false
  //   readonly eventPhase: number = 0
  //   readonly isTrusted: boolean = true
  //   returnValue = false
  //   readonly srcElement: EventTarget | null = null
  //   readonly target: EventTarget | null = null
  //   readonly timeStamp: DOMHighResTimeStamp = 0
  //   readonly type: string;
  //   composedPath(): EventTarget[] {
  //     return []
  //   }
  //   initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {

  //   }
  //   preventDefault(): void {

  //   }
  //   stopImmediatePropagation(): void {

  //   }
  //   stopPropagation(): void {

  //   }
  //   readonly AT_TARGET: number = 3;
  //   readonly BUBBLING_PHASE: number = 2;
  //   readonly CAPTURING_PHASE: number = 1;
  //   readonly NONE: number = 0;
  //   constructor(type: string) {
  //     this.type = type
  //   }
  // }

  // globalThis.CustomEvent = class CustomEvent<T> extends globalThis.Event {
  //   readonly detail: T;

  //   constructor(type: string, eventInitDict?: CustomEventInit<T>) {
  //     this.detail = eventInitDict?.detail as T
  //   }

  // }

}
