import Link from 'next/link'
import React from 'react'

const SectionHeading = ({ title, link }: { title: string, link: string }) => {
  return (
    <h2 className=' border-b mb-3 pb-1 mx-1 '>
      <Link href={link ?? ''}>{title}</Link>
    </h2>
  )
}

export default SectionHeading
