import React, { useEffect } from 'react'
import SectionHeading from './section-heading'
import { type Group } from '@/types/Group'
import GroupCover from './group-cover'
import { Button } from './ui/button'
import { EyeIcon, PlusIcon } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const Groups = () => {
  const { auth } = useAuth()
  const [groups, setGroups] = React.useState<Group[]>([])
  const [error, setError] = React.useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchGroups (username: string): Promise<Group[]> {
      try {
        const response = await axiosPrivate.get(`groups/${username}`,
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
    async function getGroups () {
      const response = await fetchGroups(auth?.user ?? '')
      if (response.length < 1) {
        setError('No groups found')
      } else {
        setError('')
        isMounted && setGroups(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroups()
    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return (
    <section>
      <SectionHeading title='YOUR GROUPS'></SectionHeading>
      {error !== '' && <p>{error}</p>}
      <ul className={'list-none grid grid-cols-2 gap-6 xl:grid-cols-3'}>
        {groups.slice(0, 5).map((group: Group) => (
          <li key={group.id}>
            <GroupCover group={group} />
          </li>
        ))}
        <li key='buttons' className=' flex flex-col'>
          <Button size='lg' variant='outline' className='rounded-lg mb-4'>
            <PlusIcon className='mr-2 h-4 w-4'></PlusIcon>
            Add group
          </Button>
          <Button size='lg' variant='secondary' className='rounded-lg'>
            <EyeIcon className='mr-2 h-4 w-4'></EyeIcon>
            View all
          </Button>
        </li>
      </ul>
    </section>
  )
}
export default Groups
