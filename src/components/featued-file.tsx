import { type File } from '@/types/File'
import { Card, CardContent } from './ui/card'
import React from 'react'
import { CalendarIcon, DownloadIcon, FileTypeIcon, UserIcon } from 'lucide-react'

const FeaturedFile = ({ file }: { file: File }) => {
  return (
    <Card className='max-w-md overflow-hidden mb-4'>
      <CardContent className='p-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex w-10 h-10 items-center justify-center rounded-full bg-gray-100'>
            <FileTypeIcon className='w-6 h-6 text-gray-500' />
          </div>
          <div className='space-y-1.5'>
            <h2 className='text-base font-semibold leading-none'>
              {file.name}
            </h2>
            <dl className='grid w-full grid-cols-3 items-center gap-1 text-xs space-x-4'>
                <div className='flex items-center space-x-1'>
                  <CalendarIcon className='w-4 h-4 text-gray-400' />
                  <dt className='sr-only'>Uploaded at</dt>
                  <dd className='text-gray-400'>
                    {file.uploadDate.toDateString()}
                  </dd>
                </div>
                <div className='flex items-center space-x-1'>
                  <UserIcon className='w-4 h-4 text-gray-400' />
                  <dt className='sr-only'>Uploaded by</dt>
                  <dd className='text-gray-400'>{file.author}</dd>
                </div>
                <div className='flex items-center space-x-1'>
                  <DownloadIcon className='w-4 h-4 text-gray-400' />
                  <dt className='sr-only'>Downloads</dt>
                  <dd className='text-gray-400'>{file.downloads}</dd>
                </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default FeaturedFile
