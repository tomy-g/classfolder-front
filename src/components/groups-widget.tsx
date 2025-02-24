import React, { useEffect, useState } from 'react'
import SectionHeading from './section-heading'
import { type Group } from '@/types/Group'
import GroupCover from './group-cover'
import { Button } from './ui/button'
import { EyeIcon, PlusIcon } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import Link from 'next/link'
import { useDebounce } from 'use-debounce'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'

const GroupsWidget = ({ globalFilter }: { globalFilter: string }) => {
  const { auth } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [textFilter, setTextFilter] = useState<string>('')
  const [debouncedTextFilter] = useDebounce(textFilter, 500)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchGroups (username: string): Promise<Group[]> {
      try {
        let url = `groups/${username}`
        if (!isNullOrUndefinedOrEmpty(globalFilter)) {
          url += `?search=${globalFilter}`
        } else if (!isNullOrUndefinedOrEmpty(debouncedTextFilter)) {
          url += `?search=${debouncedTextFilter}`
        }
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getGroups () {
      const response = await fetchGroups(auth?.user ?? '')
      if (response.length < 1) {
        setError('No groups found')
        isMounted && setGroups([])
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setGroups(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroups()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, debouncedTextFilter, globalFilter])

  return (
    <section>
      <SectionHeading title='GRUPOS' link='/groups' isFilterDisabled={Boolean(globalFilter)} textFilter={textFilter} setTextFilter={setTextFilter}></SectionHeading>
      {error !== '' && <p>{error}</p>}
      { !isLoading && <ul className={'list-none grid grid-cols-2 gap-6 xl:grid-cols-3'}>
        {groups.slice(0, 5).map((group: Group) => (
          <li key={group.id}>
            <GroupCover group={group} />
          </li>
        ))}
        <li key='buttons' className=' flex flex-col'>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='rounded-lg mb-4'
          >
            <Link href='/groups?new'>
              <PlusIcon className='mr-2 h-4 w-4'></PlusIcon>
              Add Group
            </Link>
          </Button>
          <Button asChild size='lg' variant='secondary' className='rounded-lg'>
            <Link href='/groups'>
              <EyeIcon className='mr-2 h-4 w-4'></EyeIcon>
              View all
            </Link>
          </Button>
        </li>
      </ul> }
    </section>
  )
}
export default GroupsWidget
