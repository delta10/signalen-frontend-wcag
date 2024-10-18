import React from 'react'

export const RadioGroup = (props: any) => {
  return (
    <div>
      {Object.keys(props.values).map((key: string) => (
        <div key={key}>
          <input type="radio" id={`${props.name}-${key}`} name={`${props.name}`} value={props.values[key]} />
          <label htmlFor={`${props.name}-${key}`}>{props.values[key]}</label>
        </div>
      ))}
    </div>
  )
}
