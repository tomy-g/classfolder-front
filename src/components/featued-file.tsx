import { type File } from '@/types/File'
import { Card, CardContent } from './ui/card'
import React from 'react'
import {
  CalendarIcon,
  DownloadIcon,
  UserIcon
} from 'lucide-react'
import { IconFileTypePdf } from '@tabler/icons-react'

function formatDate (date: Date): string {
  const currentYear = new Date().getFullYear()

  let formattedDate
  if (date.getFullYear() === currentYear) {
    formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
  } else {
    formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return formattedDate
}

const FeaturedFile = ({ file }: { file: File }) => {
  return (
    <Card className='max-w-sm overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex w-10 h-10 items-center justify-center rounded-md bg-secondary/75'>
            <IconFileTypePdf stroke={1.5} className='w-6 h-6 text-secondary-foreground/75' />
          </div>
          <div className='flex flex-col justify-between space-y-1.5 w-full '>
            <h2 className='text-base font-semibold leading-none align-top pt-0'>
              {file.name}
            </h2>
            <dl className='w-full flex justify-between items-center text-xs '>
              <div className='flex items-center space-x-1'>
                <CalendarIcon className='w-4 h-4 text-muted-foreground' />
                <dt className='sr-only'>Uploaded at</dt>
                <dd className='text-muted-foreground'>
                  {formatDate(file.uploadDate)}
                </dd>
              </div>
              <div className='flex items-center space-x-1'>
                <UserIcon className='w-4 h-4 text-muted-foreground' />
                <dt className='sr-only'>Uploaded by</dt>
                <dd className='text-muted-foreground'>{file.author}</dd>
              </div>
              <div className='flex items-center space-x-1'>
                <DownloadIcon className='w-4 h-4 text-muted-foreground' />
                <dt className='sr-only'>Downloads</dt>
                <dd className='text-muted-foreground'>{file.downloads}</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default FeaturedFile
