import React, { useEffect } from 'react'
import SectionHeading from './section-heading'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { type Thread } from '@/types/Thread'
import ThreadCard from './thread-card'

function ThreadsWidget () {
  const { auth } = useAuth()
  const [threads, setThreads] = React.useState<Thread[]>([])
  const [error, setError] = React.useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchThreads (username: string): Promise<Thread[]> {
      try {
        const response = await axiosPrivate.get(`threads/${username}`,
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
        setError('No threads found')
      } else {
        setError('')
        isMounted && setThreads(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getThreads()
    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])
  return (
    <section>
      <SectionHeading title={'NUEVOS HILOS'} />
      {error !== '' && <p>{error}</p>}
      <ul>
        {threads.slice(0, 3).map((thread: Thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ThreadsWidget
