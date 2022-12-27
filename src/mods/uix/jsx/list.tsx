
interface ListProps<T> {
  items: Array<T>
  // map: (item: T) => Element
  filter?: (item: T) => boolean
  children?: unknown[]
}


// export function List<T>({ items, filter = () => true, children }: ListProps<T>): Element[] {

export function List<T>({ items, filter = () => true, children }: ListProps<T>) {

  /* List API */

  /* 
    <List items={data} map={
      (item) => <Child {...item} />
    } /> 
  */

  // const element = (
  //   <>
  //     {items.map((item: T) => (
  //       <>
  //         {children.map((child) => {
  //           if (typeof child === 'function') {
  //             return child(item)
  //           } else if (typeof child === 'object') {
  //             if (Array.isArray(child)) {
  //               console.log('>', child)
  //               return child // todo:
  //             } else {
  //               return child?.cloneNode()
  //             }
  //           } else {
  //             return child
  //           } 
  //         })}
  //       </>
  //     )).flat()}
  //   </>
  // )


  // const element = []
  // // if (!filter) {
  // //   filter = () => true
  // // }
  // if (children) {
  //   for (const item of items) {
  //     if (!filter(item)) {
  //       continue
  //     }
  //     for (const child of children) {
  //       if (typeof child === 'function') {
  //         element.push(child(item))
  //       } else if (typeof child === 'object') {
  //         if (Array.isArray(child)) {
  //           console.log('>', child)
  //           element.push(...child)
  //         } else {
  //           element.push(child.cloneNode())
  //         }
  //       } else {
  //         element.push(child)
  //       }
  //     }
  //   }
  // }

  // // console.log(element)
  // return element


  // console.log(element)
  return () => {
    const element = []

    console.log('*** RERENDER:', items)
    if (children) {
      for (const item of items) {
        if (!filter(item)) {
          continue
        }
        for (const child of children) {
          // console.log(typeof child)

          if (typeof child === 'function') {
            const value = child(item)
            if (Array.isArray(value)) {
              element.push(...value)
            } else {
              element.push(value)
            }
            
          } else if (typeof child === 'object') {
            if (Array.isArray(child)) {
              console.log('>', child)
              element.push(...child)
            } else {
              element.push(child.cloneNode())
              // element.push(child)
            }
          } else {
            element.push(child)
          }
        }
      }
    }

    return element
  }



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