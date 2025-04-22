/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PencilIcon, AtSignIcon } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type User } from '@/types/User'
import ProfileForm from './profile-form'
import { useRouter } from 'next/navigation'

export default function UserProfile () {
  const URL = 'https://kw2u2431to.ufs.sh/f/'
  const { auth } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    console.log(auth)
    let isMounted = true
    const controller = new AbortController()
    async function fetchUser (): Promise<User | null> {
      try {
        const url = `users?id=${auth.userId}`
        const response = await axiosPrivate.get(url,
          {
            signal: controller.signal,
            withCredentials: true
          }
        )
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getFiles () {
      const response = await fetchUser()
      if (response === null || response === undefined) {
        setError('No user found')
        isMounted && setUser(null)
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setUser(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getFiles()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])
  const [user, setUser] = useState<User | null>(null)

  function handleCloseDialog () {
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="container max-w-4xl py-10">
      {error !== '' && <p>{error}</p>}
      { !isLoading && <Card className="overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-teal-500 to-emerald-500" />
        <div className="relative px-6">
          <Avatar className="absolute -top-16 border-4 border-background h-32 w-32 bg-background">
            <AvatarImage src={ user?.pic ? URL + user?.pic : ''} alt={user?.username} />
            <AvatarFallback className='bg-secondary text-foreground text-6xl border-none '>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex justify-end pt-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Editar perfil</DialogTitle>
                  <DialogDescription>Modifica los datos de tu perfil.</DialogDescription>
                </DialogHeader>
                {user && <ProfileForm userData={user} onSave={handleCloseDialog} />}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardHeader className="pt-8">
          <CardTitle className="text-2xl">{user?.firstName + ' ' + user?.lastName}</CardTitle>
          <CardDescription className="flex items-center">
            <AtSignIcon className="mr-1 h-4 w-4" />
            {user?.username}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        </CardContent>
      </Card> }
    </div>
  )
}
