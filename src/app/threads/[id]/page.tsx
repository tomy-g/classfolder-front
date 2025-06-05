/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Clock, Users, Send, Folder } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { type ThreadMessage } from '@/types/ThreadMessage'
import { type Thread } from '@/types/Thread'
import { useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { es } from 'date-fns/locale'

export default function Page () {
  const { auth } = useAuth()
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [thread, setThread] = useState<Thread | null>(null)
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const params = useParams()
  const threadId = params.id as string
  const [newMessage, setNewMessage] = useState('')
  const [messageAdded, setMessageAdded] = useState('')
  const URL = 'https://kw2u2431to.ufs.sh/f/'

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchThread (id: string): Promise<Thread | null> {
      try {
        const url = `threads?id=${id}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getThread () {
      const response = await fetchThread(threadId ?? '')
      if (response === null || response.title.length < 1) {
        setError('No se han encontrado el hilo')
      } else {
        setError('')
        isMounted && setThread(response)
      }
    }

    async function fetchMessages (id: string): Promise<ThreadMessage[]> {
      try {
        const url = `threadmessages/${id}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }

    async function getMessages () {
      const response = await fetchMessages(threadId ?? '')
      if (response.length < 1) {
        setError('No se han encontrado mensajes')
      } else {
        setError('')
        isMounted && setMessages(response)
      }
    }

    void (async () => {
      await getThread()
      await getMessages()
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth, axiosPrivate, threadId, messageAdded])

  async function createMessage (message: string) {
    try {
      const url = 'threadmessages'
      const data = {
        content: message,
        threadId,
        userId: auth?.userId
      }
      const response = await axiosPrivate
        .post(url, data, {
          withCredentials: true
        })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setMessageAdded(response.data.id)
    } catch (error) {
      console.error(error)
    }
  }
  function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (newMessage.trim() === '') {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createMessage(newMessage)
    setNewMessage('')
  }

  return (
    <div className='container max-w-4xl py-6 space-y-6'>
      <Card>
        <CardHeader className='space-y-4'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-bold'>{thread?.title}</h1>
              <Badge variant='outline' className='flex items-center gap-1'>
                <Folder className='h-3 w-3' />
                {thread?.groupName}
              </Badge>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
              <div className='flex items-center'>
                <Avatar className='h-6 w-6 mr-2'>
                  <AvatarImage
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    src={URL + thread?.userPic || '/placeholder.svg'}
                    alt={thread?.creatorUsername}
                  />
                  <AvatarFallback>
                    {thread?.creatorUsername?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{'@' + thread?.creatorUsername}</span>
              </div>
              <span className='mx-2'>•</span>
              <div className='flex items-center'>
                <Clock className='h-4 w-4 mr-1' />
                <span>
                  {formatDistanceToNow(thread?.creationDate ?? new Date(), {
                    addSuffix: true,
                    locale: es
                  })}
                </span>
              </div>
              <span className='mx-2'>•</span>
              <div className='flex items-center'>
                <MessageCircle className='h-4 w-4 mr-1' />
                <span>{thread?.messageCount} mensajes</span>
              </div>
            </div>
          </div>
          <Separator />
        </CardHeader>
      </Card>

      <div className='space-y-4'>
        {messages.map(message => (
          <Card key={message.id} className='overflow-hidden'>
            <CardHeader className='p-4 pb-0'>
              <div className='flex items-center space-x-2'>
                <Avatar>
                  <AvatarImage
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    src={URL + message.userPic || '/placeholder.svg'}
                    alt={message.username}
                  />
                  <AvatarFallback>{message.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{'@' + message.username}</div>
                  <div className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(message.date, {
                      addSuffix: true,
                      locale: es
                    })}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4 pt-2'>
              <p className='text-sm'>{message.content}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className='p-4 pb-0'>
              <div className='flex items-center space-x-2'>
                <Avatar>
                  <AvatarImage
                    src={URL + auth.pic || '/placeholder.svg'}
                    alt={auth.user}
                  />
                  <AvatarFallback>{auth.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='font-medium'>{auth.user}</div>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <Textarea
                placeholder='Escribe un mensaje...'
                className='resize-none min-h-[100px]'
                value={newMessage}
                onChange={e => { setNewMessage(e.target.value) }}
              />
            </CardContent>
            <CardFooter className='p-4 pt-0 flex justify-end'>
              <Button type='submit' className='gap-2'>
                <Send className='h-4 w-4' />
                Publicar mensaje
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
