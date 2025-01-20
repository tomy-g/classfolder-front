import { useEffect, useState } from 'react'
import EventCalendar from './EventCalendar'
import SectionHeading from './section-heading'
import { type Event } from '@/types/Event'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'

export default function Schedule () {
  const { auth } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchEvents (username: string): Promise<Event[]> {
      try {
        const response = await axiosPrivate.get(`events/${username}`,
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
      console.log('response', response)
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
  }, [auth])
  return (
    <section>
      <SectionHeading title='AGENDA'></SectionHeading>
      {error !== '' && <p>{error}</p>}
      {!isLoading && <EventCalendar eventsInput={events} />}
    </section>
  )
}
