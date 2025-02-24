import { useEffect, useState } from 'react'
import EventCalendar from './EventCalendar'
import SectionHeading from './section-heading'
import { type Event } from '@/types/Event'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import EventDialog from './event-dialog'
import { CalendarPlus } from 'lucide-react'
import { Button } from './ui/button'
import { type Group } from '@/types/Group'
import { useDebounce } from 'use-debounce'

export default function ScheduleWidget ({ globalFilter, groupId }: { globalFilter: string, groupId?: number }) {
  const { auth } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const [textFilter, setTextFilter] = useState<string>('')
  const [debouncedTextFilter] = useDebounce(textFilter, 500)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchEvents (username: string): Promise<Event[]> {
      try {
        let url = `events/${username}`
        if (!isNullOrUndefinedOrEmpty(groupId)) {
          url += `/${groupId}`
        }
        if (!isNullOrUndefinedOrEmpty(globalFilter)) {
          url += `?search=${globalFilter}`
        } else if (!isNullOrUndefinedOrEmpty(debouncedTextFilter)) {
          url += `?search=${debouncedTextFilter}`
        }
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
    async function getEvents () {
      const response = await fetchEvents(auth?.user ?? '')
      if (response.length < 1) {
        setError('No se han encontrado eventos')
        isMounted && setEvents([])
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setEvents(response)
        // isMounted && setIsLoading(false)
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

    async function getGroups () {
      const response = await fetchGroups(auth?.user ?? '')
      if (response.length < 1) {
        setError('No groups found')
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setGroups(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getEvents()
    void getGroups()
    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, open, debouncedTextFilter, globalFilter])
  return (
    <section>
      <SectionHeading title='AGENDA' link={''} isFilterDisabled={Boolean(globalFilter)} textFilter={textFilter} setTextFilter={setTextFilter}></SectionHeading>
      <span>{debouncedTextFilter}</span>
      <Button variant={'outline'} onClick={() => { setOpen(true) }}>
        <CalendarPlus />
        Nuevo evento
      </Button>
      <EventDialog open={open} setOpen={setOpen}/>
      {error !== '' && <p>{error}</p>}
      {!isLoading && <EventCalendar eventsInput={events} groupsInput={groups} />}
    </section>
  )
}
