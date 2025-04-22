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
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { UploadButton } from './upload-button'
import { type ExternalFile } from '@/types/ExternalFile'
import { userSchema } from '@/schemas/User'
import { type User } from '@/types/User'
import authService from '@/services/Logout'
import { useRouter } from 'next/navigation'

export default function ProfileForm ({ onSave, userData }: { onSave: () => void, userData: User }) {
  const { auth, setAuth } = useAuth()
  const router = useRouter()
  const [externalInfo, setExternalInfo] = useState<ExternalFile>({ extension: '', externalKey: '' })
  const axiosPrivate = useAxiosPrivate()
  // const controller = new AbortController()
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      firstName: '',
      id: 0,
      lastName: ''
    },
    mode: 'onChange'
  })

  async function deleteOldPic (id: string) {
    try {
      const url = `ut/${id}`
      const response = await axiosPrivate.delete(url, {
        withCredentials: true
      })
      console.log('respuesta: ', response)
    } catch (error) {
      return null
    }
  }

  async function updateUser (data: any) {
    try {
      const response = await axiosPrivate.patch('users', data, {
        // signal: controller.signal,
        withCredentials: true
      })
      console.log('respuesta: ', response)
    } catch (error) {
      return null
    }
  }

  async function completeData (data: any) {
    data.id = userData.id
    if (externalInfo.extension !== '') {
      data.extension = externalInfo?.extension
    }
    if (externalInfo.externalKey !== '') {
      if (userData.pic !== '' && userData.pic !== undefined && userData.pic !== null) {
        await deleteOldPic(userData.pic)
      }
      data.pic = externalInfo?.externalKey
    }
  }

  function logOut () {
    setAuth({
      accessToken: '',
      roles: [],
      user: '',
      pic: '',
      userId: -1
    })
    void authService.logout()
    router.push('/')
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (externalInfo.externalKey !== '') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      form.handleSubmit(onSubmit)()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalInfo])

  async function onSubmit (data: z.infer<typeof userSchema>) {
    await completeData(data)
    await updateUser(data)
    console.log(data)
    onSave()
    if (userData.username !== data.username) {
      logOut()
    }
  }

  useEffect(() => {
    form.setValue('username', userData.username)
    form.setValue('firstName', userData.firstName)
    form.setValue('lastName', userData.lastName)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    return () => {
      // controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, userData])

  return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
              {/* <UploadButton endpoint={'documentUploader'} /> */}

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                    <FormItem className='grid gap-2'>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                    <FormItem className='grid gap-2'>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />

            <UploadButton endpoint={'profilePicUploader'}
              content={{ allowedContent: 'png, jpeg...', button: 'Imagen de perfil' }}
              // disabled={!form.formState.isValid}
              onClientUploadComplete={ async (res) => {
                console.log('res: ', res)
                setExternalInfo({ externalKey: res[0].key, extension: res[0].name.split('.').pop() ?? '' })
                // await form.handleSubmit(onSubmit)()
              } }
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
              <Button type='submit' onClick={async () => {
                onSave()
                await onSubmit(form.getValues())
              }}>Actualizar datos</Button>
            </div>
            </form>
          </Form>
  )
}
