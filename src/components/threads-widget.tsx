import React, { useEffect, useState } from 'react'
import SectionHeading from './section-heading'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { type Thread } from '@/types/Thread'
import ThreadCard from './thread-card'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import { useDebounce } from 'use-debounce'

function ThreadsWidget ({ globalFilter, groupId }: { globalFilter: string, groupId?: number }) {
  const { auth } = useAuth()
  const [threads, setThreads] = React.useState<Thread[]>([])
  const [error, setError] = React.useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [textFilter, setTextFilter] = useState<string>('')
  const [debouncedTextFilter] = useDebounce(textFilter, 500)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchThreads (username: string): Promise<Thread[]> {
      try {
        let url = `threads/${username}`
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
    async function getThreads () {
      const response = await fetchThreads(auth?.user ?? '')
      if (response.length < 1) {
        setError('No se han encontrado hilos')
        isMounted && setThreads([])
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setThreads(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getThreads()
    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, debouncedTextFilter, globalFilter])
  return (
    <section>
      <SectionHeading title={'NUEVOS HILOS'} link={!isNullOrUndefinedOrEmpty(groupId) ? `${groupId}/threads` : 'threads'} isFilterDisabled={Boolean(globalFilter)} textFilter={textFilter} setTextFilter={setTextFilter}/>
      {error !== '' && <p>{error}</p>}
      { !isLoading && <ul>
        {threads.slice(0, 3).map((thread: Thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>}
    </section>
  )
}

export default ThreadsWidget
