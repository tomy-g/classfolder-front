/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type Invitation } from '@/types/Invitation'

export function Notifications () {
  const { auth } = useAuth()
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchInvitations (id: number): Promise<Invitation[]> {
      try {
        const response = await axiosPrivate.get(`invitations/${id}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getClassInvitations () {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const response = await fetchInvitations(auth?.userId ?? '')
      setError('')
      isMounted && setInvitations(response)
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getClassInvitations()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  function handleAccept (groupId: number) {
    axiosPrivate.post('groupsUsers', {
      userId: auth?.userId,
      groupId,
      roleId: 16
    }, {
      withCredentials: true
    })
      .then(() => {
        axiosPrivate.delete(`invitations/${auth.userId}/${groupId}`)
          .then(() => {
            setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation.groupId !== groupId))
          })
          .catch(error => {
            console.log('Error deleting invitation:', error)
          })
      }
      )
      .catch(error => {
        console.error('Error accepting invitation:', error)
      })
  }

  function handleDecline (groupId: number) {
    axiosPrivate.delete(`invitations/${auth.userId}/${groupId}`)
      .then(() => {
        setInvitations(prevInvitations => prevInvitations.filter(invitation => invitation.groupId !== groupId))
      })
      .catch(error => {
        console.log('Error deleting invitation:', error)
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {invitations.length > 0 && (
            <span className='absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white'>
              {invitations.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              Invitaciones a grupos
            </p>
            <p className='text-xs text-muted-foreground'>
              {invitations.length}
              {invitations.length !== 1 ? ' invitaciones pendientes' : ' invitación pendiente'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className='max-h-[300px] overflow-y-auto'>
          {invitations.length > 0
            ? (
                invitations.map(invitation => (
              <div key={invitation.groupId} className='p-3'>
                <div className='mb-2'>
                  <p className='font-medium'>{invitation.groupName}</p>
                  <p className='text-sm text-muted-foreground'>
                    Invitado por {invitation.inviterUsername}
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    size='sm'
                    onClick={() => { handleAccept(invitation.groupId) }}
                    className='w-full'
                  >
                    Aceptar
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => { handleDecline(invitation.groupId) }}
                    className='w-full'
                  >
                    Rechazar
                  </Button>
                </div>
                {invitation.groupId !== invitations[invitations.length - 1].groupId && (
                  <DropdownMenuSeparator className='mt-3' />
                )}
              </div>
                ))
              )
            : (
            <div className='p-3 text-center text-sm text-muted-foreground'>
              No tienes invitaciones pendientes
            </div>
              )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
