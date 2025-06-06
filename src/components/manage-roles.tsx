/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Settings, Shield } from 'lucide-react'
import { type User } from '@/types/User'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export default function ManageRoles (groupId: { groupId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const URL = 'https://kw2u2431to.ufs.sh/f/'

  const toggleModeratorRole = async (userId: number) => {
    try {
      const url = 'users/setRole'
      const newRole = users.find(user => user.id === userId)?.role === 23 ? 16 : 23
      const response = await axiosPrivate.post(url + `/${userId}/${groupId.groupId}/${newRole}`, {
        withCredentials: true
      })

      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, role: user.role === 23 ? 16 : 23 } : user
        )
      )
    } catch (error) {
      console.log('Error deleting file:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchUsers (id: string): Promise<User[]> {
      try {
        const url = `users/byGroupId/${id}`
        const response = await axiosPrivate.get(url,
          {
            signal: controller.signal,
            withCredentials: true
          }
        )
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getUsers () {
      if (!groupId.groupId) {
        return
      }
      const response = await fetchUsers(groupId.groupId.toString())
      if (response.length < 1) {
        isMounted && setUsers([])
        isMounted && setIsLoading(false)
      } else {
        isMounted && setUsers(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getUsers()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return (
    <div className=''>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant='default' >
            <Settings className='h-4 w-4' />
            Gestionar roles
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Gestionar roles del grupo
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className='max-h-[400px] pr-4'>
            <div className='space-y-4'>
              {users.map(user => (
                <div
                  key={user.id}
                  className='flex items-center justify-between space-x-4 p-3 rounded-lg border bg-card'
                >
                  <div className='flex items-center space-x-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={ URL + user.pic || '/placeholder.svg'}
                        alt={user.username}
                      />
                      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-foreground truncate'>
                        {'@' + user.username}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + ' ' +
                          user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      {user.role
                        ? (
                        <div className='flex items-center gap-1'>
                          <Shield className='h-3 w-3' />
                          <span>Moderador</span>
                        </div>
                          )
                        : (
                        <div className='flex items-center gap-1'>
                          <Shield className='h-3 w-3' />
                          <span>Usuario</span>
                        </div>
                          )}
                    </div>
                    <Switch
                      id={`moderator-${user.id}`}
                      checked={user.role === 23}
                      onCheckedChange={() => { void toggleModeratorRole(user.id) }}
                    />
                    <Label htmlFor={`moderator-${user.id}`} className='sr-only'>
                      {user.role === 23
                        ? 'Quitar rol de moderador'
                        : 'Asignar rol de moderador'}{' '}
                      a {user.username}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className='flex justify-end pt-4 border-t'>
            <Button onClick={() => { setIsOpen(false) }}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
