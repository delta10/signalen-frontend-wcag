import React from 'react'

type IncidentFormFooterProps = {} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({ children }: IncidentFormFooterProps) => {
  return <div className="bg-gray-200 w-full p-3">{children}</div>
}

export { IncidentFormFooter }
