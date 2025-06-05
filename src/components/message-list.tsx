/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { UserSelector } from './user-selector'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type RecentMessage } from '@/types/RecentMessage'
import useAuth from '@/hooks/useAuth'
import { type User } from '@/types/User'
import { formatSmartDate } from '@/utils/utils'

export default function MessageList ({ interlocutor, setInterlocutor }: { interlocutor: User | null, setInterlocutor: (user: User | null) => void }) {
  const { auth } = useAuth()
  const [error, setError] = useState<string>('')
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchRecentMessages (id: string): Promise<RecentMessage[]> {
      try {
        const url = `messages/recent/${id}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }

    async function getRecentMessages () {
      if (!auth.userId) {
        setError('No se ha encontrado el usuario')
        return
      }
      const response = await fetchRecentMessages(String(auth.userId))
      if (response.length < 1) {
        setError('No se han encontrado mensajes')
      } else {
        setError('')
        isMounted && setRecentMessages(response)
      }
    }

    void (async () => {
      await getRecentMessages()
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth, axiosPrivate, interlocutor])

  async function fetchUser (id: string): Promise<User | null> {
    try {
      const url = `users?id=${id}`
      const response = await axiosPrivate.get(url, {
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
      setError('No se ha encontrado el usuario')
    } else {
      setError('')
      setInterlocutor(response)
    }
  }

  function setActiveConversation (conversationId: string) {
    void (async () => {
      await getUser(conversationId)
    })()
  }
  const [showNewMessage, setShowNewMessage] = useState(false)
  const URL = 'https://kw2u2431to.ufs.sh/f/'

  return (
    <div className='w-full md:w-80 border-r flex flex-col'>
      <div className='p-4 border-b'>
        <Button
          variant='outline'
          className='w-full justify-start gap-2'
          onClick={() => setShowNewMessage(true)}
        >
          <Plus className='h-4 w-4' />
          Nuevo mensaje
        </Button>
      </div>

      {showNewMessage && (
        <div className='p-4 border-b'>
          <UserSelector setInterlocutor={setInterlocutor} onSelect={() => setShowNewMessage(false)} />
        </div>
      )}

      <div className='px-4 py-2 font-medium text-sm flex items-center justify-between'>
        <span>Conversaciones recientes</span>
        <span className='text-muted-foreground text-xs'>
          {recentMessages.length}
        </span>
      </div>

      <ScrollArea className='flex-1'>
        <div className='flex flex-col gap-0.5'>
          {recentMessages.map(conversation => (
            <Button
              key={conversation.username}
              variant='ghost'
              className={cn(
                'flex items-start gap-3 p-3 h-auto justify-start rounded-none w-full relative',
                interlocutor !== null && interlocutor.id === conversation.userId && 'bg-muted'
              )}
              onClick={() => {
                setActiveConversation(String(conversation.userId))
                setShowNewMessage(false)
              }}
            >
              <Avatar className='h-10 w-10 flex-shrink-0'>
                <AvatarImage
                  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                  src={URL + conversation.userPic || '/placeholder.svg'}
                  alt={conversation.username}
                />
                <AvatarFallback>
                  {conversation.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start gap-1 w-full overflow-hidden'>
                <div className='flex items-center justify-between w-full'>
                  <span className='font-medium'>{'@' + conversation.username}</span>
                  <span className='text-xs text-muted-foreground'>
                    {formatSmartDate(conversation.date)}
                  </span>
                </div>
                <div className='text-xs text-muted-foreground truncate w-full text-left'>
                  {conversation.content}
                </div>
              </div>
              {/* {conversation.isReceived && (
                <div className='absolute right-3 top-3 w-2 h-2 bg-primary rounded-full' />
              )} */}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
