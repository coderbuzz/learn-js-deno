// https://github.com/denomod/deno_html

export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  const parts: string[] = [strings[0]]

  for (let i = 0; i < values.length; i++) {
    parts.push(String(values[i]))
    parts.push(strings[i + 1])
  }

  return parts.join("")
}

export const css = html

export function importFile(filename: string): string {
  return Deno.readTextFileSync(filename)
}

/* 
import { html } from "https://deno.land/x/html/mod.ts";

let languages = ["Rust", "JavaScript", "TypeScript"];

const str = html`
  <div class="list">
    <ul>
      ${languages.map((x) => `<li>${x}</li>`)}
    </ul>
  </div>
`;

console.log(str);
*/