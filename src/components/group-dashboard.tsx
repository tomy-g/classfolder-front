import FilesWidget from './files-widget'
import QuickSearch from './quick-search'
import ScheduleWidget from './schedule-widget'
import ThreadsWidget from './threads-widget'

function GroupDashboard ({ groupId }: { groupId: number }) {
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch />
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        <ScheduleWidget groupId={groupId} />
        <FilesWidget groupId={groupId}/>
        <ThreadsWidget groupId={groupId}/>
      </div>
    </main>
  )
}

export default GroupDashboard
