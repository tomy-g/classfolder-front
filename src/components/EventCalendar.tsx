'use client'
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import {
  type CalendarEventExternal,
  viewMonthAgenda
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useTheme } from 'next-themes'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { useEffect, useState } from 'react'
import '../utils/schedule.css'
import '../app/globals.css'
import { type Event } from '@/types/Event'

export default function EventCalendar ({ eventsInput }: { eventsInput: Event[] }) {
  const [finalEvents, setFinalEvents] = useState<any[]>([])
  function formatDate (inputDate: Date) {
    const date = inputDate instanceof Date ? inputDate : new Date(inputDate)
    // Extract year, month, day, hours, and minutes
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    // Return the formatted date
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  async function convertEvents (
    events: Event[]
  ): Promise<CalendarEventExternal[]> {
    return events.map(event => {
      return {
        id: event.id,
        title: event.title,
        start: formatDate(event.date),
        end: formatDate(event.date),
        calendarId: 'johndoe'
      }
    })
  }
  const eventModal = createEventModalPlugin()
  const { theme } = useTheme()
  const eventsServicePlugin = createEventsServicePlugin()
  const calendarApp = useNextCalendarApp({
    views: [viewMonthAgenda],
    locale: 'es-ES',
    isDark: theme === 'dark',
    theme: 'shadcn',
    plugins: [eventModal, eventsServicePlugin],
    calendars: {
      johndoe: {
        label: 'John Doe',
        colorName: 'johndoe',
        lightColors: {
          main: '#3667DB',
          container: '#F1F5F9',
          onContainer: '#020817'
        },
        darkColors: {
          main: '#3B82F6',
          container: '#1E293B',
          onContainer: '#F8FAFC'
        }
      }
    },
    // selectedDate: '2023-12-01',
    // eslint-disable-next-line object-shorthand
    events: []
  })
  useEffect(() => {
    calendarApp?.setTheme(theme === 'light' ? 'light' : 'dark')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])
  useEffect(() => {
    console.log('se ejecuta el useEffect')
    async function fetchEvents () {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const convertedEvents = await convertEvents(eventsInput)
      // const fetchedEvents = await mockEvents()
      // convertedEvents = fetchedEvents
      // setEvents(fetchedEvents)

      setFinalEvents(convertedEvents)

      // if (eventsServicePlugin !== undefined) {
      //   eventsServicePlugin.set(convertedEvents)
      // }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsInput])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  calendarApp?.events.set(finalEvents)
  return (
    <div className='schedule'>
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  )
}
