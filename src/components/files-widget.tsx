import React, { useEffect, useState } from 'react'
import FileCard from './file-card'
import { type File } from '@/types/File'
import SectionHeading from './section-heading'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import { useDebounce } from 'use-debounce'
export default function FilesWidget ({ globalFilter, groupId }: { globalFilter: string, groupId?: number }) {
  const { auth } = useAuth()
  const [files, setFiles] = React.useState<File[]>([])
  const [error, setError] = React.useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [textFilter, setTextFilter] = useState<string>('')
  const [debouncedTextFilter] = useDebounce(textFilter, 500)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchFiles (username: string): Promise<File[]> {
      try {
        let url = `files/${username}`
        if (!isNullOrUndefinedOrEmpty(groupId)) {
          url += `/${groupId}`
        }
        if (!isNullOrUndefinedOrEmpty(globalFilter)) {
          url += `?search=${globalFilter}`
        } else if (!isNullOrUndefinedOrEmpty(debouncedTextFilter)) {
          url += `?search=${debouncedTextFilter}`
        }
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
        isMounted && setFiles([])
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setFiles(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getFiles()
    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, debouncedTextFilter, globalFilter])
  return (
    <section>
      <SectionHeading title='ARCHIVOS DESTACADOS' link={'files'} isFilterDisabled={Boolean(globalFilter)} textFilter={textFilter} setTextFilter={setTextFilter}></SectionHeading>
      {error !== '' && <p>{error}</p>}
      {!isLoading && <ol className='list-none grid grid-cols-1 gap-4 2xl:grid-cols-2'>
        {files.slice(0, 6).map((file: File) => (
          <li key={file.id}>
            <FileCard file={file} />
          </li>
        ))}
      </ol>}
    </section>
  )
}
