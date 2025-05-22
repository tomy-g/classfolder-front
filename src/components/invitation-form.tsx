/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
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
import { type User } from '@/types/User'
import { invitationSchema } from '@/schemas/Invitation'

export default function InvitationForm ({ onSave, group }: { onSave: () => void, group: number }) {
  const { auth } = useAuth()
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [classMatesNotInGroup, setClassmatesNotInGroup] = useState<User[]>([])
  const form = useForm<z.infer<typeof invitationSchema>>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      invitedId: 0,
    //   groupId: 0,
    //   inviterId: 0
    }
  })

  async function createInvitation (data: any) {
    try {
      await axiosPrivate.post('invitations', data, {
        withCredentials: true
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function onSubmit (data: z.infer<typeof invitationSchema>) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const newInvitation: any = data
    newInvitation.groupId = group ?? 0
    newInvitation.inviterId = auth?.userId ?? 0
    if (newInvitation.invitedId < 1 || newInvitation.groupId < 1 || newInvitation.inviterId < 1) {
      console.error('Invalid data')
      return
    }
    await createInvitation(newInvitation)
    console.log(newInvitation)
    onSave()
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchClassMatesNotInGroup (id: number): Promise<User[]> {
      try {
        const response = await axiosPrivate.get(`users/classmatesNotInGroup/${id}/${group}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getClassMatesNotInGroup () {
      const response = await fetchClassMatesNotInGroup(auth?.userId ?? '')
      if (response.length < 1) {
        setError('No users found')
      } else {
        setError('')
        isMounted && setClassmatesNotInGroup(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getClassMatesNotInGroup()
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
            name='invitedId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compañero</FormLabel>
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
                        <SelectValue placeholder='Elige un compañero al que desees invitar' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classMatesNotInGroup.map(classmate => (
                        <SelectItem key={classmate.id} value={classmate.id.toString()}>
                          {classmate.username}
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
            <Button type='submit'>Invitar</Button>
          </div>
        </form>
      </Form>
  )
}
