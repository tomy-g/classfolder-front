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
import { groupSchema } from '@/schemas/Group'
import { type Community } from '@/types/Community'
import { Textarea } from './ui/textarea'

export default function GroupForm ({ onSave }: { onSave: () => void }) {
  const { auth } = useAuth()
  const [communities, setCommunities] = useState<Community[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      title: '',
      description: '',
      communityId: 0
    }
  })

  async function createGroup (data: any) {
    try {
      const response = await axiosPrivate.post('groups', data, {
        withCredentials: true
      })
      console.log(response)
      const groupId = response?.data?.id
      const addGroupUser = await axiosPrivate.post('groupsUsers', {
        userId: auth?.userId,
        groupId,
        roleId: 42
      }, {
        withCredentials: true
      })
      console.log(addGroupUser)
    } catch (error) {
      console.error(error)
    }
  }

  async function onSubmit (data: z.infer<typeof groupSchema>) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!data.communityId || data.communityId < 1) {
      data.communityId = null
    }
    await createGroup(data)
    console.log(data)
    onSave()
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchCommunties (username: string): Promise<Community[]> {
      try {
        const response = await axiosPrivate.get(`communities/owns/${username}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getCommunities () {
      const response = await fetchCommunties(auth?.user ?? '')
      if (response.length < 1) {
        setError('No se han encontrado comunidades')
      } else {
        setError('')
        isMounted && setCommunities(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCommunities()
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
                  <Input placeholder='Economía 1º' {...field} />
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
            name='communityId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comunidad</FormLabel>
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
                        <SelectValue placeholder='¿Desas añadir este grupo a una comunidad existente?' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem defaultChecked={true} key={'0'} value={'0'}>
                            - No añadir a ninguna comunidad -
                        </SelectItem>
                      {communities.map(community => (
                        <SelectItem key={community.id} value={community.id.toString()}>
                          {community.title}
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
            <Button type='submit'>Crear Grupo</Button>
          </div>
        </form>
      </Form>
  )
}
