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

export default function ScheduleWidget ({ groupId }: { groupId?: number }) {
  const { auth } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchEvents (username: string): Promise<Event[]> {
      try {
        const url = isNullOrUndefinedOrEmpty(groupId) ? `events/${username}` : `events/${username}/${groupId}`
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
        setError('No events found')
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setEvents(response)
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getEvents()
    return () => {
      isMounted = false
      controller.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, open])
  return (
    <section>
      <SectionHeading title='AGENDA'></SectionHeading>
      <Button variant={'outline'} onClick={() => { setOpen(true) }}>
        <CalendarPlus />
        Nuevo evento
      </Button>
      <EventDialog open={open} setOpen={setOpen}/>
      {error !== '' && <p>{error}</p>}
      {!isLoading && <EventCalendar eventsInput={events}/>}
    </section>
  )
}
