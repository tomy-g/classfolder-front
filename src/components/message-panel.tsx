/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'

import React, { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MessageSquare } from 'lucide-react'
import { type User } from '@/types/User'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type RecentMessage } from '@/types/RecentMessage'

export function MessagePanel ({ interlocutor }: { interlocutor: User | null }) {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<RecentMessage[]>([])
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')
  const [newMessageAdded, setNewMessageAdded] = useState(null)

  function addMessageInfo (): any {
    return {
      sender: auth.userId,
      receiver: interlocutor?.id,
      date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      content: newMessage,
    }
  }

  async function createMessage (data: any) {
    try {
      const url = 'messages'
      const response = await axiosPrivate.post(url, data, {
        withCredentials: true
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setNewMessageAdded(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return
    const completeData = addMessageInfo()
    await createMessage(completeData)
    setNewMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSendMessage()
    }
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchRecentMessages (id: string): Promise<RecentMessage[]> {
      try {
        const url = `messages/conversation/${id}/${auth.userId}`
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
      if (!interlocutor) {
        setMessages([])
        return
      }
      if (!auth.userId) {
        setError('No se ha encontrado el usuario')
        return
      }
      const response = await fetchRecentMessages(String(interlocutor.id))
      if (response.length < 1) {
        setError('No se han encontrado mensajes')
      } else {
        setError('')
        isMounted && setMessages(response)
      }
    }

    void (async () => {
      await getRecentMessages()
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth, axiosPrivate, interlocutor, newMessageAdded])

  return (
    <div className='flex-1 flex flex-col h-[45rem]'>
      {interlocutor
        ? (
        <>
          <div className='border-b p-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Avatar className='h-8 w-8'>
                <AvatarImage
                  src={interlocutor.pic ?? '/placeholder.svg'}
                  alt={interlocutor.username}
                />
                <AvatarFallback>
                  {interlocutor.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>
                  {interlocutor.username}
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className='flex-1 p-4'>
            <div className='flex flex-col gap-4'>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    !message.isReceived ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className='h-8 w-8 mt-1 flex-shrink-0'>
                    <AvatarImage
                      src={
                        !message.isReceived
                          ? auth.pic ?? '/placeholder.svg'
                          : interlocutor.pic ?? '/placeholder.svg'
                      }
                      alt={
                        !message.isReceived
                          ? auth.user
                          : interlocutor.username
                      }
                    />
                    <AvatarFallback>
                      {!message.isReceived
                        ? auth.user.charAt(0)
                        : interlocutor.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      !message.isReceived ? 'items-end' : ''
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        !message.isReceived
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className='text-xs text-muted-foreground mt-1'>
                      {message.date.toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className='border-t p-4'>
            <div className='flex gap-2'>
              <Input
                placeholder='Escribe un mensaje...'
                value={newMessage}
                onChange={e => { setNewMessage(e.target.value) }}
                onKeyDown={handleKeyDown}
                className='flex-1'
              />
              <Button
                size='icon'
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </>
          )
        : (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center max-w-md p-8'>
            <div className='flex justify-center mb-4'>
              <div className='p-4 rounded-full bg-muted'>
                <MessageSquare className='h-8 w-8 text-muted-foreground' />
              </div>
            </div>
            <h3 className='text-xl font-medium mb-2'>
              No has seleccionado un usuario.
            </h3>
            <p className='text-muted-foreground mb-4'>
              Elige un usuario de la lista de mensajes recientes para empezar a conversar.
            </p>
          </div>
        </div>
          )}
    </div>
  )
}
