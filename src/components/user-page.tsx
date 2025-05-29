/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AtSignIcon, Mail } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type User } from '@/types/User'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import uniqolor from 'uniqolor'

export default function UserPage () {
  const params = useParams()
  const userId = params.id as string
  const URL = 'https://kw2u2431to.ufs.sh/f/'
  const { auth } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    if (auth.userId === Number(userId)) {
      router.push('/profile')
    }
    let isMounted = true
    const controller = new AbortController()
    async function fetchUser (): Promise<User | null> {
      try {
        const url = `users?id=${userId}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getUser () {
      const response = await fetchUser()
      if (response === null || response === undefined) {
        setError('No se ha encontrado el usuario')
        isMounted && setUser(null)
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setUser(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getUser()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  const [gradientStyle, setGradientStyle] = useState({})

  useEffect(() => {
    if (user === null) {
      return
    }
    const baseKey = user.username.toString()
    const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches

    const color1 = uniqolor(baseKey, {
      differencePoint: isLightMode ? 50 : undefined,
    }).color

    const color2 = uniqolor(baseKey + '_', {
      differencePoint: isLightMode ? 50 : undefined,
    }).color

    setGradientStyle({
      backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
    })
  }, [user, userId])

  return (
    <div className='container max-w-4xl py-10'>
      {error !== '' && <p>{error}</p>}
      {!isLoading && (
        <Card className='overflow-hidden'>
          <div className='h-40' style={gradientStyle} />
          <div className='relative px-6'>
            <Avatar className='absolute -top-16 border-4 border-background h-32 w-32 bg-background'>
              <AvatarImage
                src={user?.pic ? URL + user?.pic : ''}
                alt={user?.username}
              />
              <AvatarFallback className='bg-secondary text-foreground text-6xl border-none '>
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex justify-end pt-4'>
              {user && <Button asChild variant={'outline'}>
                  <Link href={`/messages/?id=${userId}`}>
                  <Mail/>
                    <span className='mb-[1px]'>Enviar mensaje</span>
                  </Link>
               </Button>}
            </div>
          </div>
          <CardHeader className='pt-8'>
            <CardTitle className='text-2xl'>
              {user?.firstName + ' ' + user?.lastName}
            </CardTitle>
            <CardDescription className='flex items-center'>
              <AtSignIcon className='mr-1 h-4 w-4' />
              {user?.username}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'></CardContent>
        </Card>
      )}
    </div>
  )
}
