import { generateUploadDropzone } from '@uploadthing/react'

export const DropZone = generateUploadDropzone({
  url: 'http://localhost:4000/uploadthing',
})
