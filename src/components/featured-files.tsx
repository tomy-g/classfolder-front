import React from 'react'
import FeaturedFile from './featued-file'
import { type File } from '@/types/File'
const FeaturedFiles = ({ files }: { files: File[] }) => {
  return (
    <ul className='list-none'>
      {files.map((file: File) => (
        <li key={file.id}>
          <FeaturedFile file={file} />
        </li>
      ))}
    </ul>
  )
}

export default FeaturedFiles
