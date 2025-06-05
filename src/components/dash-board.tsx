/* eslint-disable react-hooks/exhaustive-deps */
'use client'
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import QuickSearch from './quick-search'
import ScheduleWidget from './schedule-widget'
import GroupsWidget from './groups-widget'
import FilesWidget from './files-widget'
import ThreadsWidget from './threads-widget'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import SortableItem from './sortable'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'

export default function Dashboard () {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [isOrderLoaded, setIsOrderLoaded] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const widgets = {
    ScheduleWidget,
    FilesWidget,
    GroupsWidget,
    ThreadsWidget,
  }
  type WidgetKey = keyof typeof widgets
  const defaultOrder: WidgetKey[] = ['ScheduleWidget', 'FilesWidget', 'GroupsWidget', 'ThreadsWidget']
  const [widgetOrder, setWidgetOrder] = useState(defaultOrder)
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = widgetOrder.indexOf(active.id)
    const newIndex = widgetOrder.indexOf(over.id)
    const newOrder = arrayMove(widgetOrder, oldIndex, newIndex)

    setWidgetOrder(newOrder)
    void saveToDatabase(newOrder)
  }

  const keyCharMap: Record<WidgetKey, string> = {
    FilesWidget: 'f',
    ScheduleWidget: 's',
    GroupsWidget: 'g',
    ThreadsWidget: 't',
  }
  function encodeOrder (order: WidgetKey[]): string {
    return order.map(key => keyCharMap[key]).join('')
  }
  async function saveToDatabase (order: WidgetKey[]) {
    const encoded = encodeOrder(order)
    const user = {
      id: auth?.userId,
      username: auth?.user,
      config: encoded
    }
    try {
      await axiosPrivate.patch('/users', user, { withCredentials: true })
      console.log('Order saved successfully:', encoded)
    } catch (error) {
      console.log('Error saving order:', error)
    }
  }
  useEffect(() => {
    console.log(globalFilter)
  }, [globalFilter])
  useEffect(() => {
    if (!auth?.userId) {
      setWidgetOrder(defaultOrder)
      return
    }
    let isMounted = true
    const controller = new AbortController()
    const widgetCharMap: Record<string, WidgetKey> = {
      f: 'FilesWidget',
      s: 'ScheduleWidget',
      g: 'GroupsWidget',
      t: 'ThreadsWidget',
    }
    function decodeOrder (code: string): WidgetKey[] {
      return code
        .split('')
        .map(char => widgetCharMap[char])
        .filter((key): key is WidgetKey => Boolean(key))
    }
    async function fetchOrder (userId: string): Promise<string | null> {
      try {
        const response = await axiosPrivate.get(`/users?id=${userId}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data.config || null
      } catch (error) {
        console.log('Error fetching user config:', error)
        return null
      }
    }
    async function getOrder () {
      const response = await fetchOrder(String(auth.userId))
      if (response) {
        const decodedOrder = decodeOrder(response)
        if (decodedOrder.length > 0) {
          isMounted && setWidgetOrder(decodedOrder)
        } else {
          isMounted && setWidgetOrder(defaultOrder)
        }
      } else {
        isMounted && setWidgetOrder(defaultOrder)
      }
      setIsOrderLoaded(true)
    }
    void getOrder()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth])
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      { isOrderLoaded && (<DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
        <div className="grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center">
          {widgetOrder.map((key) => {
            const WidgetComponent = widgets[key as WidgetKey]
            return (
              <SortableItem key={key} id={key}>
                <WidgetComponent globalFilter={globalFilter} />
              </SortableItem>
            )
          })}
        </div>
      </SortableContext>
    </DndContext>)}
    </main>
  )
}
