import { useEffect, useState } from 'react'
import FilesWidget from './files-widget'
import QuickSearch from './quick-search'
import ScheduleWidget from './schedule-widget'
import ThreadsWidget from './threads-widget'

function GroupDashboard ({ groupId }: { groupId: number }) {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  useEffect(() => {
    console.log(globalFilter)
  }, [globalFilter])
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        <ScheduleWidget globalFilter={globalFilter} groupId={groupId} />
        <FilesWidget globalFilter={globalFilter} groupId={groupId}/>
        <ThreadsWidget globalFilter={globalFilter} groupId={groupId}/>
      </div>
    </main>
  )
}

export default GroupDashboard
