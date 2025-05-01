/* eslint-disable @typescript-eslint/strict-boolean-expressions */

'use client'

import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FilePlus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type Thread } from '@/types/Thread'
import ThreadCard from '@/components/thread-card'
import ThreadDialog from '@/components/thread-dialog'

export default function Page () {
  const searchParams = useSearchParams()
  const isOpen = (searchParams.get('new') !== null)
  const { auth } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState(isOpen)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchThreads (username: string): Promise<Thread[]> {
      try {
        const url = `threads/${username}`
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
  }, [auth, axiosPrivate])

  return (
    <main className='flex mx-auto my-8 w-full max-w-screen-3xl items-center justify-center px-4 flex-col'>
      <h2 className='text-2xl font-semibold mb-6'>Hilos de todos tus grupos</h2>
      <Button className='mb-4' variant={'outline'} onClick={() => { setOpen(true) }}>
        <FilePlus />
        Nuevo hilo
      </Button>
      <ThreadDialog groupId={null} open={open} setOpen={setOpen}/>
      {error && <p className='text-red-500'>{error}</p>}
      <ul className='w-1/2'>
        {threads.map((thread: Thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>
    </main>
  )
}
