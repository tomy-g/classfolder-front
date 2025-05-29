/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useState } from 'react'
import FilesWidget from './files-widget'
import QuickSearch from './quick-search'
import ScheduleWidget from './schedule-widget'
import ThreadsWidget from './threads-widget'
import { type Group } from '@/types/Group'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { Button } from './ui/button'
import { UserPlus } from 'lucide-react'
import InvitationDialog from './invitation-dialog'
import RankingWidget from './ranking-widget'

function GroupDashboard ({ groupId }: { groupId: number }) {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [error, setError] = useState<string>('')
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchGroup (groupId: number): Promise<Group | null> {
      try {
        const url = `groups?id=${groupId}`
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
    async function getGroup () {
      const response = await fetchGroup(groupId)
      console.log(response?.id)
      if (response === null || response.id === '' || response.id === undefined) {
        setError('No group found')
        isMounted && setGroup(null)
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setGroup(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroup()
    return () => {
      isMounted = false
      controller.abort()
    }
  }
  , [axiosPrivate, groupId, auth])
  useEffect(() => {
    console.log(globalFilter)
  }, [globalFilter])
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      {!isLoading && group?.title && (
        <h2 className='text-3xl font-bold ml-0'>
          {group.title.charAt(0).toUpperCase() + group.title.slice(1)}
        </h2>
      )}
      {error !== '' && <p>{error}</p>}
      <QuickSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      {
  auth.roles.some(
    role =>
      // eslint-disable-next-line eqeqeq
      role.group_id == groupId &&
      // eslint-disable-next-line eqeqeq
      (role.role_id == 23 || role.role_id == 42)
  ) && (
    <>
      <Button variant={'outline'} onClick={() => { setOpen(true) }}><UserPlus />Invitar usuario</Button>
      <InvitationDialog open={open} setOpen={setOpen} groupId={groupId}/>
    </>
  )
}
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        <ScheduleWidget globalFilter={globalFilter} groupId={groupId} />
        <FilesWidget globalFilter={globalFilter} groupId={groupId}/>
        <ThreadsWidget globalFilter={globalFilter} groupId={groupId}/>
        <RankingWidget groupId={groupId}/>
      </div>
    </main>
  )
}

export default GroupDashboard
