/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type User } from '@/types/User'
import useAuth from '@/hooks/useAuth'

interface UserSelectorProps {
  onSelect?: (userId: string) => void
  setInterlocutor?: (user: User | null) => void
}

export function UserSelector ({ onSelect, setInterlocutor }: UserSelectorProps) {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')
  const [classMates, setClassmates] = useState<User[]>([])
  const URL = 'https://kw2u2431to.ufs.sh/f/'

  useEffect(() => {
    const isMounted = true
    const controller = new AbortController()
    async function fetchClassMates (id: string): Promise<User[]> {
      try {
        const url = `users/classmates/${id}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getClassMates (id: string) {
      const response = await fetchClassMates(id)
      if (response === null || response.length < 1) {
        setError('No se han encontrado compañeros')
      } else {
        setError('')
        isMounted && setClassmates(response)
      }
    }
    if (auth.userId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getClassMates(String(auth.userId))
    }
  }, [axiosPrivate, auth])

  const handleSelect = (userId: string) => {
    setSelectedUser(userId)
    setInterlocutor && setInterlocutor(classMates.find(user => String(user.id) === userId) ?? null)
    setOpen(false)
    if (onSelect) onSelect(userId)
  }

  const selectedUserData = classMates.find(user => String(user.id) === selectedUser)

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>Mensaje a:</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='justify-between'
          >
            {selectedUser
              ? (
              <div className='flex items-center gap-2'>
                <Avatar className='h-6 w-6'>
                  <AvatarImage
                    src={ URL + selectedUserData?.pic || '/placeholder.svg'}
                    alt={selectedUserData?.username}
                  />
                  <AvatarFallback>
                    {selectedUserData?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedUserData?.username}</span>
              </div>
                )
              : (
                  'Selecciona un usuario...'
                )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0 w-[300px]'>
          <Command>
            <CommandInput placeholder='Buscar usuario...' />
            <CommandList>
              <CommandEmpty>No se han encontrado usuarios</CommandEmpty>
              <CommandGroup>
                {classMates.map(user => (
                  <CommandItem
                    key={user.id}
                    value={user.username}
                    onSelect={() => { handleSelect(String(user.id)) }}
                    className='flex items-center gap-2'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={ URL + user.pic || '/placeholder.svg'}
                        alt={user.username}
                      />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span>{user.firstName + ' ' + user.lastName}</span>
                      <span className='text-xs text-muted-foreground'>
                        @{user.username}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedUser === String(user.id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
