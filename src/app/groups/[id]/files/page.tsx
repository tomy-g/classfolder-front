/* eslint-disable @typescript-eslint/strict-boolean-expressions */

'use client'

import FileDialog from '@/components/file-dialog'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FilePlus } from 'lucide-react'
import { useSearchParams, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type File } from '@/types/File'
import FileCard from '@/components/file-card'

export default function Page () {
  const searchParams = useSearchParams()
  const params = useParams()
  const isOpen = (searchParams.get('new') !== null)
  const { auth } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState(isOpen)
  const axiosPrivate = useAxiosPrivate()
  const groupId = params.id as string

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchFiles (username: string): Promise<File[]> {
      try {
        const url = `files/${username}/${groupId}`
        const response = await axiosPrivate.get(url,
          {
            signal: controller.signal,
            withCredentials: true
          }
        )
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getFiles () {
      const response = await fetchFiles(auth?.user ?? '')
      if (response.length < 1) {
        setError('No files found')
      } else {
        setError('')
        isMounted && setFiles(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getFiles()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth, axiosPrivate, groupId])

  return (
    <main className='flex mx-auto my-8 w-full max-w-screen-3xl items-center justify-center px-4 flex-col'>
      <h2 className='text-2xl font-semibold mb-6'>Archivos destacados de todos tus grupos</h2>
      <Button variant={'outline'} onClick={() => { setOpen(true) }}>
        <FilePlus />
        Nuevo archivo
      </Button>
      {/* <UploadButton endpoint={'imageUploader'} /> */}
      <FileDialog groupId={Number(groupId)} open={open} setOpen={setOpen}/>
      {error && <p className='text-red-500'>{error}</p>}
      <ol className='list-none flex flex-col gap-4 w-1/3'>
        {files.map((file: File) => (
          <li className='w-full' key={file.id}>
            <FileCard file={file} />
          </li>
        ))}
      </ol>
    </main>
  )
}
