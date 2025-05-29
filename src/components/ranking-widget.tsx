/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type User } from '@/types/User'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import { Crown, Award, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className='h-6 w-6 text-yellow-500 dark:text-yellow-300' />
    case 2:
      return <Award className='h-5 w-5 text-slate-500 dark:text-slate-300' />
    case 3:
      return <Award className='h-5 w-5 text-amber-600 dark:text-amber-500' />
    default:
      return null
  }
}

const getMedalColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-300'
    case 2:
      return 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-300'
    case 3:
      return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500'
    default:
      return 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-700'
  }
}

export default function RankingWidget ({ groupId }: { groupId?: number }) {
  const [users, setUsers] = useState<User[]>([])
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const URL = 'https://kw2u2431to.ufs.sh/f/'

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchUsers (): Promise<User[]> {
      try {
        const url = `users/ranking/${groupId}`
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
      const response = await fetchUsers()
      if (response.length < 1) {
        setError('No files found')
        isMounted && setUsers([])
        isMounted && setIsLoading(false)
      } else {
        setError('')
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
  }, [])

  return (
    <section>
     <div className='flex flex-row border-b mb-3 pb-1 mx-1 items-end justify-between'>
      <h2 className='inline-flex w-4/5 pt-[16px]'>
        <Link href={''}>RANKING DE USUARIOS</Link>
      </h2>
    </div>
        {users.map(user => (
          <Link href={`/user/${user.id}`} className='no-underline' key={user.id}>
            <div
              key={user.id}
              className={`flex items-center max-w-sm gap-3 mb-4 p-3 rounded-lg border transition-colors ${getMedalColor(
                users.indexOf(user) + 1
              )}`}
            >
              <div className='flex-shrink-0'>{getMedalIcon(users.indexOf(user) + 1)}</div>

            <Avatar className='h-10 w-10 ml-4'>
              <AvatarImage
                src={user.pic && user.pic.trim() !== '' ? URL + user.pic : '/placeholder.svg'}
                alt={user.username}
              />
              <AvatarFallback className='text-sm font-medium'>
                {user.username
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
              <p className='font-medium text-sm truncate'>{'@' + user.username}</p>
              <p className='text-xs text-muted-foreground truncate'>
                {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) + ' ' + user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}
              </p>
            </div>

            <Badge variant='secondary' className='text-xs font-medium'>
              <Star className='inline h-4 w-4 mr-2 fill-current' />
              {(user.totalScore ?? 0).toLocaleString() + ' pts'}
            </Badge>
          </div>
        </Link>
        ))}
  </section>
  )
}
