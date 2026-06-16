import React from 'react'

export default function DecoratorTable({ children }) {
  return (
    <div className="">
      <table className="  ">
        {children &&
          children.rows[0].cells[0] &&
          children.rows[0].cells[1] !== '' && (
            <thead className="">
              <tr className="">
                {children &&
                  children.rows[0].cells.map((cellItem, index) => {
                    return (
                      <th className="" key={index}>
                        {cellItem}
                      </th>
                    )
                  })}
              </tr>
            </thead>
          )}

        <tbody className="">
          {children &&
            children.rows.map((rowItem, index) => {
              return (
                index !== 0 && (
                  <tr className="" key={index}>
                    {rowItem.cells.map((cellItem, index) => {
                      return (
                        <td
                          className=""
                          key={index}
                          dangerouslySetInnerHTML={{ __html: cellItem }}
                        ></td>
                      )
                    })}
                  </tr>
                )
              )
            })}
        </tbody>
      </table>
    </div>
  )
}
