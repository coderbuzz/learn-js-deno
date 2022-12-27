
interface ListProps<T> {
  items: Array<T>
  // map: (item: T) => Element
}


export function List<T>({ items }: ListProps<T>, children: unknown[]): Element[] {

  /* List API */

  /* 
    <List items={data} map={
      (item) => <Child {...item} />
    } /> 
  */

  const element = (
    <>
      {items.map((item: T) => (
        <>
          {children.map((child) => typeof child === 'function' ? child(item) : typeof child === 'object' ? child?.cloneNode() : child)}
        </>
      ))}
    </>
  )

  // console.log(element)
  return element



  // return <>
  //   {/* {items.map((item: T) => children.map((child: unknown) => typeof child === 'function' ? child(item) : child))} */}

  //   {/* {
  //     items.map((item: T) => (
  //       <>
  //         {console.log(count++)}
  //         {children.map((child: unknown) => typeof child === 'function' ? child(item) : child)}
  //       </>)
  //     )
  //   } */}

  //   {
  //     items.map((item: T) => {
  //       // console.log('count', count++) 
  //       // return children.map((child: unknown) => {
  //       //   console.log('count', count++)
  //       //   return typeof child === 'function' ? child(item) : child
  //       // })

  //       return <>
  //         {children.map((child: unknown) => {
  //           console.log('count', count++)
  //           return typeof child === 'function' ? child(item) : child
  //         })}
  //       </>
  //     })
  //   }


  // </>
}