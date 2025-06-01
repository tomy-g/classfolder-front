/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { type Thread } from '@/types/Thread'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import ThreadCard from '@/components/thread-card'
import { useParams } from 'next/navigation'
import { type Group } from '@/types/Group'
import { Button } from '@/components/ui/button'
import { FilePlus } from 'lucide-react'
import ThreadDialog from '@/components/thread-dialog'

export default function Page () {
  const { auth } = useAuth()
  const [threads, setThreads] = React.useState<Thread[]>([])
  const [error, setError] = React.useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const params = useParams()
  const groupId = params.id as string
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState<Group | null>(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchThreads (username: string): Promise<Thread[]> {
      try {
        let url = `threads/${username}`
        if (!isNullOrUndefinedOrEmpty(groupId)) {
          url += `/${groupId}`
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
    async function fetchGroup (groupId: string): Promise<Group | null> {
      try {
        const response = await axiosPrivate.get(`groups?id=${groupId}}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getGroup () {
      const response = await fetchGroup(groupId)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (response) {
        setError('')
        setGroup(response)
      } else {
        setError('Grupo no encontrado')
      }
    }
    async function getThreads () {
      const response = await fetchThreads(auth?.user ?? '')
      if (response.length < 1) {
        setError('No se han encontrado hilos')
        isMounted && setThreads([])
      } else {
        setError('')
        isMounted && setThreads(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getThreads()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroup()

    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, axiosPrivate])
  return (
    <main className='flex mx-auto my-8 w-full max-w-screen-3xl items-center justify-center px-4 flex-col'>
      <h2 className='text-2xl font-semibold mb-6'>Hilos en {group?.title}</h2>
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
