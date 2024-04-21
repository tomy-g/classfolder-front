import React from 'react'
import FeaturedFile from './featued-file'
import { type File } from '@/types/File'
import SectionHeading from './section-heading'
const FeaturedFiles = ({ files }: { files: File[] }) => {
  return (
    <section>
      <SectionHeading title='FEATURED FILES'></SectionHeading>
      <ul className='list-none'>
        {files.map((file: File) => (
          <li key={file.id}>
            <FeaturedFile file={file} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default FeaturedFiles
