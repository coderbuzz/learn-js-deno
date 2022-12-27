// deno-lint-ignore-file no-explicit-any
/** @jsxImportSource https://esm.sh/react */

export default (...args: any[]) => {
  console.log(args);

  return (
    <>
      <div> Header</div>
      <div style={{ width: '100%', height: '100%' }}>
        <span>Hello world!</span>
      </div>
      {[1, 2, 3].forEach(item => (
        <div>{item}</div>
      ))}
    </>
  )
}
