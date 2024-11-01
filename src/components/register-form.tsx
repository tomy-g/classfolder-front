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

export function RegisterForm () {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  async function onSubmit (values: z.infer<typeof registerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await authService.register({
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password
    })
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Register</CardTitle>
        <CardDescription>
          Enter an username and password below to register a new account
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
                    <Input
                      placeholder='example01'
                      {...field}
                      onBlur={async () => {
                        const usernameExists =
                          await authService.checkUsernameExists(field.value)
                        if (usernameExists) {
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
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Anna' {...field} />
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
                  <FormLabel>Last Name</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Register
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <Link href='/login' className='underline'>
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
