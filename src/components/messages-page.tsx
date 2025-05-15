'use client'
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import MessageList from '@/components/message-list'
import { MessagePanel } from '@/components/message-panel'
import { type User } from '@/types/User'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export default function MessagesPage () {
  const [interlocutor, setInterlocutor] = useState<User | null>(null)
  const searchParams = useSearchParams()
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const isMounted = true
    const controller = new AbortController()
    async function fetchUser (id: string): Promise<User | null> {
      try {
        const url = `users?id=${id}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getUser (id: string) {
      const response = await fetchUser(id ?? '')
      if (response === null || response.username.length < 1) {
        setError('No se han encontrado el ususario')
      } else {
        setError('')
        isMounted && setInterlocutor(response)
      }
    }

    const userId = searchParams.get('id')
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getUser(userId)
    }
  }, [axiosPrivate, searchParams])

  return (
    <div className=' max-w-screen-3xl px-10 mx-auto flex flex-col'>
      <div className='flex-1 flex overflow-hidden'>
        <MessageList interlocutor={interlocutor} setInterlocutor={setInterlocutor} />
        <MessagePanel interlocutor={interlocutor} />
      </div>
    </div>
  )
}
