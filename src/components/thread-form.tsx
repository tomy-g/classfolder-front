/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { type z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Textarea } from './ui/textarea'
import { type Group } from '@/types/Group'
import { threadSchema } from '@/schemas/Thread'

export default function ThreadForm ({
  groupId,
  onSave
}: {
  groupId: number | null | undefined
  onSave: () => void
}) {
  const { auth } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const form = useForm<z.infer<typeof threadSchema>>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      title: '',
      message: '',
      groupId: 0
    },
    mode: 'onChange'
  })

  async function createThread (data: any): Promise<number> {
    try {
      const response = await axiosPrivate.post('threads', data, {
        withCredentials: true
      })
      console.log('respuesta: ', response)
      return Number(response?.data?.id)
    } catch (error) {
      console.error(error)
      return -1 // Return a default value in case of an error
    }
  }

  async function createMessage (data: any) {
    try {
      const response = await axiosPrivate.post('threadmessages', data, {
        withCredentials: true
      })
      console.log('respuesta: ', response)
    } catch (error) {
      console.error(error)
    }
  }

  function completeThreadData (data: any) {
    data.creatorId = auth?.userId
    return data
  }

  function completeMessageData (data: any, threadId: number) {
    data.userId = auth?.userId
    data.threadId = threadId
    data.content = data.message
    return data
  }

  async function onSubmit (data: z.infer<typeof threadSchema>) {
    const dataForThread = completeThreadData(data)
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const threadId = await createThread(dataForThread)
    const dataForMessage = completeMessageData(data, threadId)
    threadId > 0 && await createMessage(dataForMessage)
    onSave()
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchGroups (username: string): Promise<Group[]> {
      try {
        const response = await axiosPrivate.get(`groups/${username}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getGroups () {
      const response = await fetchGroups(auth?.user ?? '')
      if (response.length < 1) {
        setError('No groups found')
      } else {
        setError('')
        isMounted && setGroups(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroups()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input placeholder='Duda problema 3' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem className='grid gap-2'>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='groupId'
            render={({ field }) => {
              const isGroupIdFixed = groupId !== null && groupId !== undefined
              return (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  {error !== '' && <p>{error}</p>}
                  {error === '' && (
                    <Select
                      onValueChange={value => {
                        if (!isGroupIdFixed) {
                          field.onChange(Number(value))
                        }
                      }}
                      value={(isGroupIdFixed ? groupId : field.value)?.toString()}
                      disabled={isGroupIdFixed}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un grupo al que perteneces' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map(group => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <div className='flex justify-end space-x-2'>
          <Button
              type='submit'
            >
              Publicar
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                onSave()
              }}
            >
              Cancelar
            </Button>
            {/* <Button type='submit'>Publicar Archivo</Button> */}
          </div>
        </form>
      </Form>
  )
}
