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

export function LoginForm () {
  const authContext = useAuth()
  const { setAuth } = authContext ?? {}
  const [error, setError] = useState('')

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  async function onSubmit (values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await authService.login({
      username: values.username,
      password: values.password
    })
    if (response.error !== null && response.error !== undefined) {
      setError(response.error)
      return
    }
    const accessToken = response.accessToken
    setAuth?.({ accessToken })
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
