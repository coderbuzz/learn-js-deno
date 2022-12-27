import './jsx/ssr.ts'
import { jsx } from './mod.ts'
import htm from './jsx/hsx.ts'

const html = htm(jsx)

function logString(value: unknown) {
  console.log(`${value}\n`)
}

const log = logString

class MySibling {
  render() {
    return (
      <>
        <a href="https://www.w3schools.com">Visit W3Schools.com!</a>
        <div>MySibling</div>
      </>
    )
  }
}

function MyChild() {
  const child = 'MyChild!';
  return (
    <pre>
      <div>
        <br />
        <input type="text" id="fname" name="fname" /><br /><br />
        <div>{child}</div>
      </div>
    </pre>
  )
}

function MyForm() {
  return html`
    <form action="/action_page.php">
      <label for="fname">First name:</label>
      <input type="text" id="fname" name="fname" /><br /><br />
      <label for="lname">Last name:</label>
      <input type="text" id="lname" name="lname" /><br /><br />
      <input type="submit" value="Submit" />
    </form>`
}

// ----------------------------------------------------------------

const barJSX = <div id="bar">
  Child of Bar
  <MyChild />
  <MySibling />
  <MyForm />
</div>

log('---BAR JSX---')
log(barJSX)

// ----------------------------------------------------------------

const barHSX = html`<div id="bar">
  Child of Bar
  <${MyChild} />
  <${MySibling} />
  <${MyForm} />
</div>`

log('---BAR HSX---')
log(barHSX)

// ----------------------------------------------------------------

console.log('RESULT:', `${barJSX}` === `${barHSX}`)
