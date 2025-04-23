/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import authService from '@/services/Register'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/schemas/Register'
import { type z } from 'zod'
import { PasswordInput } from './ui/password-input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type ExternalFile } from '@/types/ExternalFile'
import { UploadButton } from './upload-button'

export function RegisterForm () {
  const [error, setError] = useState('')
  const router = useRouter()
  const [externalInfo, setExternalInfo] = useState<ExternalFile>({ extension: '', externalKey: '' })
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      passwordConfirmation: ''
    }
  })

  function completeData (data: any) {
    if (externalInfo?.externalKey !== undefined && externalInfo?.externalKey !== null) {
      data.pic = externalInfo?.externalKey
    } else {
      data.pic = null
    }
    return data
  }

  async function onSubmit (values: z.infer<typeof registerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const completedData = completeData(values)
    const response = await authService.register({
      username: completedData.username,
      firstName: completedData.firstName,
      lastName: completedData.lastName,
      password: completedData.password,
      pic: completedData?.pic
    })
    if (response.error !== null && response.error !== undefined) {
      setError(response.error)
      return
    }
    router.push('/login')
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Registro</CardTitle>
        <CardDescription>
          Introduce un nombre de usuario y una contraseña para registrarte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='ana123'
                      {...field}
                      onBlur={async () => {
                        const usernameDoesNotExist =
                          await authService.checkUsernameExists(field.value)
                        if (!usernameDoesNotExist) {
                          form.setError('username', {
                            type: 'custom',
                            message: 'Username already exists'
                          })
                        } else {
                          form.clearErrors('username')
                        }
                      }}
                    />
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
                    <Input placeholder='Ana' {...field} />
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
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder='Adams' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='passwordConfirmation'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel>Confirma tu contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UploadButton endpoint={'profilePicUploader'}
                          content={{ allowedContent: 'png, jpeg...', button: 'Imagen de perfil' }}
                          disabled={externalInfo?.externalKey.length > 0}
                          onClientUploadComplete={ async (res) => {
                            console.log('res: ', res)
                            setExternalInfo({ externalKey: res[0].key, extension: res[0].name.split('.').pop() ?? '' })
                            // await form.handleSubmit(onSubmit)()
                          } }
                        />
            {(error !== '') && (
              <FormMessage>
                Algo salió mal. Por favor, intentalo de nuevo.
              </FormMessage>
            )}
            <Button type='submit' className='w-full'>
              Registrar cuenta
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          ¿Ya tienes una cuenta?{' '}
          <Link href='/login' className='underline'>
            Inicia sesión aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
