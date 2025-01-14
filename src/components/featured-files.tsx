import React, { useEffect } from 'react'
import FeaturedFile from './featued-file'
import { type File } from '@/types/File'
import SectionHeading from './section-heading'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
function FeaturedFiles () {
  const { auth } = useAuth()
  const [files, setFiles] = React.useState<File[]>([])
  const [error, setError] = React.useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchFiles (username: string): Promise<File[]> {
      try {
        const response = await axiosPrivate.get(`files/${username}`,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])
  return (
    <section>
      <SectionHeading title='FEATURED FILES'></SectionHeading>
      {error !== '' && <p>{error}</p>}
      <ol className='list-none grid grid-cols-1 gap-4 2xl:grid-cols-2'>
        {files.slice(0, 6).map((file: File) => (
          <li key={file.id}>
            <FeaturedFile file={file} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default FeaturedFiles
