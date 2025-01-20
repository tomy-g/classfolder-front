'use client'
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import {
  type CalendarEventExternal,
  viewMonthAgenda
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useTheme } from 'next-themes'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { useEffect } from 'react'
import '../utils/schedule.css'
import '../app/globals.css'
import { type Event } from '@/types/Event'

export default function EventCalendar ({ eventsInput }: { eventsInput: Event[] }) {
  // async function mockEvents (): Promise<CalendarEventExternal[]> {
  //   // Simulate a delay using a Promise
  //   await new Promise(resolve => setTimeout(resolve, 3000))
  //   return [
  //     {
  //       id: 1,
  //       title: 'Coffee with John',
  //       start: '2023-12-01',
  //       end: '2023-12-01',
  //       calendarId: 'johndoe'
  //     },
  //     {
  //       id: 2,
  //       title: 'Breakfast with Sam',
  //       description: 'Discuss the new project',
  //       location: 'Starbucks',
  //       start: '2023-11-29 05:00',
  //       end: '2023-11-29 06:00',
  //       calendarId: 'johndoe'
  //     },
  //     {
  //       id: 3,
  //       title: 'Gym',
  //       start: '2023-11-27 06:00',
  //       end: '2023-11-27 07:00',
  //       calendarId: 'johndoe'
  //     },
  //     {
  //       id: 4,
  //       title: 'Media fasting',
  //       start: '2023-12-01',
  //       end: '2023-12-03',
  //       calendarId: 'johndoe'
  //     },
  //     {
  //       id: 5,
  //       title: 'Some appointment',
  //       people: ['John'],
  //       start: '2023-12-03 03:00',
  //       end: '2023-12-03 04:30',
  //       calendarId: 'johndoe'
  //     }
  //   ]
  // }

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
  // const [events, setEvents] = useState<CalendarEventExternal[]>([])
  const eventsServicePlugin = createEventsServicePlugin()
  const { theme } = useTheme()
  useEffect(() => {
    calendarApp?.setTheme(theme === 'light' ? 'light' : 'dark')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])
  useEffect(() => {
    async function fetchEvents () {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const convertedEvents = await convertEvents(eventsInput)
      // const fetchedEvents = await mockEvents()
      // convertedEvents = fetchedEvents
      // setEvents(fetchedEvents)
      eventsServicePlugin.set(convertedEvents)
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsInput])
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
  return (
    <div className='schedule'>
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  )
}
