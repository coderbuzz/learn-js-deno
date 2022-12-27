/**
 * Document Factory
 * Expose Browser's global document instance in Deno environment
 * To be use in jsx-runtime.ts
 * Copyright 2022, Indra Gunawan <indra.sync@gmail.com>
 */

import { document as VDocument } from './document.ts'

if (typeof globalThis.document === 'undefined') {
  globalThis.document = VDocument as unknown as Document
}
