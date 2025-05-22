/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Textarea } from './ui/textarea'
import { communitySchema } from '@/schemas/Community'

export default function CommunityForm ({ onSave }: { onSave: () => void }) {
  const { auth } = useAuth()
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const form = useForm<z.infer<typeof communitySchema>>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      title: '',
      description: '',
    }
  })

  async function createCommunity (data: any) {
    try {
      const response = await axiosPrivate.post('communities', data, {
        withCredentials: true
      })
      console.log(response)
      const communityId = response?.data?.id
    } catch (error) {
      console.log(error)
    }
  }

  async function onSubmit (data: z.infer<typeof communitySchema>) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const completeData: any = data
    completeData.creator = auth?.userId ?? 0
    await createCommunity(completeData)
    console.log(data)
    onSave()
  }

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
                  <Input placeholder='Escuela de...' {...field} />
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
            <Button type='submit'>Crear Comunidad</Button>
          </div>
        </form>
      </Form>
  )
}
