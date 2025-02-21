'use client'
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import {
  type CalendarEventExternal,
  type CalendarType,
  viewMonthAgenda,
  viewMonthGrid
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useTheme } from 'next-themes'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { useEffect, useState } from 'react'
import '../utils/schedule.css'
import '../app/globals.css'
import { type Event } from '@/types/Event'
import { type Group } from '@/types/Group'
import uniqolor from 'uniqolor'

export default function EventCalendar ({ eventsInput, groupsInput }: { eventsInput: Event[], groupsInput: Group[] }) {
  const [finalEvents, setFinalEvents] = useState<any[]>([])
  const finalCalendars = groupsInput.reduce<Record<string, CalendarType>>((acc, group) => {
    acc[group.id] = {
      label: group.title,
      colorName: group.id,
      lightColors: {
        main: uniqolor(group.title.toString() + group.id, { differencePoint: 50 }).color,
        container: '#F1F5F9',
        onContainer: '#020817'
      },
      darkColors: {
        main: uniqolor(group.title.toString() + group.id).color,
        container: '#1E293B',
        onContainer: '#F8FAFC'
      }
    }
    return acc
  }, {})

  function formatDate (inputDate: Date) {
    const date = inputDate instanceof Date ? inputDate : new Date(inputDate)
    // Extract year, month, day, hours, and minutes
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
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
        calendarId: event.groupId.toString(),
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        description: `${event.groupName.toUpperCase()}${event.description ? `: ${event.description}` : ''}`
      }
    })
  }

  const eventModal = createEventModalPlugin()
  const { theme } = useTheme()
  const eventsServicePlugin = createEventsServicePlugin()
  const calendarApp = useNextCalendarApp({
    views: [viewMonthGrid, viewMonthAgenda],
    locale: 'es-ES',
    isDark: theme === 'dark',
    theme: 'shadcn',
    plugins: [eventModal, eventsServicePlugin],
    calendars: finalCalendars,

    // eslint-disable-next-line object-shorthand
    events: []
  })

  useEffect(() => {
    calendarApp?.setTheme(theme === 'light' ? 'light' : 'dark')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, calendarApp])
  useEffect(() => {
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
  if (groupsInput.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    calendarApp?.events.set(finalEvents)
  }
  return (
    <div className='schedule'>
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  )
}
