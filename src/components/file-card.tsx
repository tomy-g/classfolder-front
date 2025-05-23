import { type File } from '@/types/File'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import React from 'react'
import { FileIcon, ImageIcon, FileTextIcon, Download } from 'lucide-react'
import Link from 'next/link'

const getFileIcon = (extension: string) => {
  switch (extension) {
    case 'pdf':
      return (
        <FileTextIcon className='h-6 w-6 text-red-500' aria-hidden='true' />
      )
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <ImageIcon className='h-6 w-6 text-blue-500' aria-hidden='true' />
    case 'ppt':
      return <FileIcon className='h-6 w-6 text-orange-500' aria-hidden='true' />
    case 'doc':
      return <FileIcon className='h-6 w-6 text-green-500' aria-hidden='true' />
    default:
      return <FileIcon className='h-6 w-6 text-gray-500' aria-hidden='true' />
  }
}

function formatDate (date: Date): string {
  const currentYear = new Date().getFullYear()
  const dateNew = new Date(date.toString())
  let formattedDate
  if (dateNew.getFullYear() === currentYear) {
    formattedDate = dateNew.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
  } else {
    formattedDate = dateNew.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  return formattedDate
}

const FileCard = ({ file }: { file: File }) => {
  return (
    <Card>
      <CardContent className='flex items-center p-4'>
        <div className='mr-4' aria-hidden='true'>
          {getFileIcon(file.extension)}
        </div>
        <div className='flex-grow min-w-0'>
          <Link href={`/files/${file.id}`} className='hover:underline'>
            <h3 className='text-lg font-semibold truncate'>
              <span className='sr-only'>File name: </span>
              {file.title}
            </h3>
          </Link>
          <div className='flex items-center mt-2'>
            <Avatar className='h-6 w-6 mr-2'>
              <AvatarImage src={file.authorAvatar} alt='' />
              <AvatarFallback>{file.authorUsername.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className='text-sm text-muted-foreground truncate'>
              <span className='sr-only'>Author: </span>
              {file.authorUsername}
            </span>
            <span className='text-sm ml-4 text-background truncate bg-muted-foreground px-2 rounded-full'>
              {file.group}
            </span>
          </div>
        </div>
        <div className='text-right ml-4'>
          <p className='text-sm text-muted-foreground'>
            <span className='sr-only'>Upload date: </span>
            {formatDate(new Date(file.uploadDate))}
          </p>
          <div
            className='flex items-center justify-end mt-2'
            aria-label={`${file.downloads} downloads`}
          >
            <Download className='h-4 w-4 mr-1' aria-hidden='true' />
            <span className='text-sm font-medium'>{file.downloads}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default FileCard
