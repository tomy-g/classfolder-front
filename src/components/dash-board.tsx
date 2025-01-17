import React from 'react'
import QuickSearch from './quick-search'
import Schedule from './schedule-widget'
import Groups from './groups-widget'
import FeaturedFiles from './files-widget'
import Threads from './threads-widget'

function Dashboard () {
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch />
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        <Schedule />
        <FeaturedFiles />
        <Groups />
        <Threads />
      </div>
    </main>
  )
}

export default Dashboard
