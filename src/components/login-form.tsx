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
import authService from '@/services/Login'
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
import { loginSchema } from '@/schemas/Login'
import { type z } from 'zod'
import { useState } from 'react'
import { PasswordInput } from './ui/password-input'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Checkbox } from './ui/checkbox'

export function LoginForm () {
  const { setAuth } = useAuth()
  const [error, setError] = useState('')
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      persist: false
    }
  })

  async function onSubmit (values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await authService.login({
      username: values.username,
      password: values.password,
      persist: values.persist
    })
    if (response.error !== null && response.error !== undefined) {
      setError(response.error)
      return
    }
    const accessToken = response.accessToken
    const roles = (response.roles ?? {})
    const user = response.user ?? ''
    const pic = response.pic ?? ''
    const userId = response.userId ?? ''
    setAuth({
      accessToken,
      roles,
      user,
      pic,
      userId
    })
    router.push('/')
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='example01' {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(error !== '') && (
              <FormMessage>
                Username or password is incorrect
              </FormMessage>
            )}
            <FormField
              control={form.control}
              name="persist"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mantener sesión iniciada
                    </FormLabel>
                  </div>
                </FormItem>
              )}
        />
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='underline'>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
