import React from 'react'

const SectionHeading = ({ title }: { title: string }) => {
  return (
    <h2 className=' border-b mb-2 pb-1 mx-1 ' >
      <a className=''>{title}</a>
    </h2>
  )
}

export default SectionHeading
