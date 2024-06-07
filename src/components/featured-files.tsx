import React from 'react'
import FeaturedFile from './featued-file'
import { type File } from '@/types/File'
import SectionHeading from './section-heading'
const FeaturedFiles = ({ files }: { files: File[] }) => {
  return (
    <section>
      <SectionHeading title='FEATURED FILES'></SectionHeading>
      <ol className='list-none grid grid-cols-1 gap-4 2xl:grid-cols-2'>
        {files.map((file: File) => (
          <li key={file.id}>
            <FeaturedFile file={file} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default FeaturedFiles
