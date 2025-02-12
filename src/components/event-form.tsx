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
import { eventSchema } from '@/schemas/Event'
import { DateTimePicker } from './ui/date-time-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { useEffect, useState } from 'react'
import { type Group } from '@/types/Group'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Textarea } from './ui/textarea'

export default function EventForm ({ onSave }: { onSave: () => void }) {
  const { auth } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: undefined,
      groupId: 0
    }
  })

  async function addUserInfo (data: z.infer<typeof eventSchema>) {
    return {
      ...data,
      authorId: auth?.userId,
      date: data.date.toISOString().slice(0, 19).replace('T', ' ')
    }
  }

  async function createEvent (data: any) {
    try {
      const response = await axiosPrivate.post('events', data, {
        withCredentials: true
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  async function onSubmit (data: z.infer<typeof eventSchema>) {
    const completeData = await addUserInfo(data)
    await createEvent(completeData)
    console.log(data)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder='Examen de...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem className='flex w-72 flex-col gap-2'>
              <FormLabel htmlFor='datetime'>Fecha</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='groupId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo</FormLabel>
              {error !== '' && <p>{error}</p>}
              {error === '' && (
                <Select
                  onValueChange={value => {
                    field.onChange(Number(value))
                  }}
                  value={field.value?.toString()}
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
          )}
        />

        <div className='flex justify-end space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              onSave()
            }}
          >
            Cancelar
          </Button>
          <Button type='submit'>Crear Evento</Button>
        </div>
      </form>
    </Form>
  )
}
