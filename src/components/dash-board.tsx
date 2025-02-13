import React from 'react'
import QuickSearch from './quick-search'
import ScheduleWidget from './schedule-widget'
import GroupsWidget from './groups-widget'
import FilesWidget from './files-widget'
import ThreadsWidget from './threads-widget'

function Dashboard () {
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch />
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        <ScheduleWidget />
        <FilesWidget />
        <GroupsWidget />
        <ThreadsWidget />
      </div>
    </main>
  )
}

export default Dashboard
