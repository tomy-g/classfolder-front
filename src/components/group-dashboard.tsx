/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
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
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import SortableItem from './sortable'

function GroupDashboard ({ groupId }: { groupId: number }) {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [error, setError] = useState<string>('')
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const widgets = {
    ScheduleWidget,
    FilesWidget,
    RankingWidget,
    ThreadsWidget
  }
  type WidgetKey = keyof typeof widgets
  const defaultOrder: WidgetKey[] = [
    'ScheduleWidget',
    'FilesWidget',
    'ThreadsWidget',
    'RankingWidget',
  ]
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
    RankingWidget: 'r',
    ThreadsWidget: 't',
  }
  const widgetCharMap: Record<string, WidgetKey> = {
    f: 'FilesWidget',
    s: 'ScheduleWidget',
    r: 'RankingWidget',
    t: 'ThreadsWidget',
  }
  function decodeOrder (code: string): WidgetKey[] {
    return code
      .split('')
      .map(char => widgetCharMap[char])
      .filter((key): key is WidgetKey => Boolean(key))
  }
  function encodeOrder (order: WidgetKey[]): string {
    return order.map(key => keyCharMap[key]).join('')
  }
  async function saveToDatabase (order: WidgetKey[]) {
    const encoded = encodeOrder(order)
    const group = {
      id: groupId,
      config: encoded
    }
    try {
      await axiosPrivate.patch('/groups', group, { withCredentials: true })
      console.log('Order saved successfully:', encoded)
    } catch (error) {
      console.log('Error saving order:', error)
    }
  }
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchGroup (groupId: number): Promise<Group | null> {
      try {
        const url = `groups?id=${groupId}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getGroup () {
      const response = await fetchGroup(groupId)
      console.log(response?.id)
      if (
        response === null ||
        response.id === '' ||
        response.id === undefined
      ) {
        setError('No group found')
        isMounted && setGroup(null)
        isMounted && setIsLoading(false)
      } else {
        setError('')
        isMounted && setGroup(response)
        const decodedOrder = decodeOrder(response.config ?? '')
        if (decodedOrder.length > 0) {
          isMounted && setWidgetOrder(decodedOrder)
        } else {
          isMounted && setWidgetOrder(defaultOrder)
        }
        isMounted && setIsLoading(false)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGroup()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth])
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
      <QuickSearch
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {auth.roles.some(
        role =>
          // eslint-disable-next-line eqeqeq
          role.group_id == groupId &&
          // eslint-disable-next-line eqeqeq
          (role.role_id == 23 || role.role_id == 42)
      ) && (
        <>
          <Button
            variant={'outline'}
            onClick={() => {
              setOpen(true)
            }}
          >
            <UserPlus />
            Invitar usuario
          </Button>
          <InvitationDialog open={open} setOpen={setOpen} groupId={groupId} />
        </>
      )}

      {auth.roles.some(
        role =>
          // eslint-disable-next-line eqeqeq
          role.group_id == groupId &&
          // eslint-disable-next-line eqeqeq
          (role.role_id == 23 || role.role_id == 42)
      )
        ? (
        <DndContext
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
                        <WidgetComponent globalFilter={globalFilter} groupId={groupId} />
                      </SortableItem>
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>)
        : (
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        {widgetOrder.map((key) => {
          const WidgetComponent = widgets[key as WidgetKey]
          return (
            <WidgetComponent key={key} globalFilter={globalFilter} groupId={groupId} />
          )
        })}
      </div>
          )}
    </main>
  )
}

export default GroupDashboard
