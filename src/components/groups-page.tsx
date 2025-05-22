/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

'use client'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type Group } from '@/types/Group'
import { type Community } from '@/types/Community'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderPlus, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import GroupDialog from '@/components/group-dialog'
import CommunityDialog from './community-dialog'

export default function GroupsPage () {
  const searchParams = useSearchParams()
  const isOpen = (searchParams.get('new') !== null)
  const { auth } = useAuth()
  const [communities, setCommunities] = useState<Community[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string>('')
  const [groupsOpen, setGroupsOpen] = useState(isOpen)
  const [communitiesOpen, setCommunitiesOpen] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchCommunities (username: string): Promise<Community[]> {
      try {
        const response = await axiosPrivate.get(`communities/${username}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function fetchGroups (username: string): Promise<Group[]> {
      try {
        const response = await axiosPrivate.get(`groups/${username}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getCommunitiesAndGroups () {
      const responseCommunities = await fetchCommunities(auth?.user ?? '')
      const responseGroups = await fetchGroups(auth?.user ?? '')
      if (responseGroups.length < 1) {
        setError('No groups found')
      } else {
        setError('')
        setCommunities(responseCommunities)
        isMounted && setGroups(responseGroups)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCommunitiesAndGroups()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth, axiosPrivate])

  const groupedByCommunity = groups.reduce<
  Record<number, { title: string, groups: Group[] }>
  >((acc, group) => {
    const communityId = group.communityId ?? -1
    if (!acc[communityId]) {
      const community =
        communities.find(c => Number(c.id) === communityId) ?? null
      acc[communityId] = {
        title: community?.title ?? 'Sin comunidad',
        groups: []
      }
    }
    acc[communityId].groups.push(group)
    return acc
  }, {})

  return (
    <main className='flex mx-auto my-8 w-full max-w-screen-3xl items-center justify-center px-4 flex-col'>
      <h2 className='text-2xl font-semibold mb-6'>Todos tus Grupos</h2>
      <div className='flex gap-4 mb-4'>
      <Button variant={'outline'} onClick={() => { setGroupsOpen(true) }}>
        <FolderPlus />
        Nuevo grupo
      </Button>
      <Button variant={'outline'} onClick={() => { setCommunitiesOpen(true) }}>
        <Users />
        Nueva comunidad
      </Button>
      </div>
      <GroupDialog open={groupsOpen} setOpen={setGroupsOpen}/>
      <CommunityDialog open={communitiesOpen} setOpen={setCommunitiesOpen}/>
      {error && <p className='text-red-500'>{error}</p>}
      <Accordion className='w-1/2' type='multiple' defaultValue={['1', '2', '-1']}>
        {Object.entries(groupedByCommunity).map(([communityId, community]) => (
          <AccordionItem key={communityId} value={communityId}>
            <AccordionTrigger className='flex items-center gap-4'>
              <span>{community.title}</span>
            </AccordionTrigger>
            <AccordionContent className='grid gap-4 p-4'>
              {community.groups.map(group => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Card className='cursor-pointer hover:border-primary transition duration-100 ease-in-out'>
                    <CardContent className='flex items-center gap-4 p-4'>
                      <span>{group.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
