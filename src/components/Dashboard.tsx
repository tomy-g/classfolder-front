import React from 'react'
import QuickSearch from './quick-search'
import Schedule from './schedule'
import Groups from './groups'
import FeaturedFiles from './featured-files'
import Topics from './topics'
import files from '@/constants/mocks/Files'
import groups from '@/constants/mocks/Groups'

function Dashboard () {
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch />
      <div className='grid lg:grid-cols-2 gap-16 mt-8 w-full justify-center'>
        <Schedule />
        <FeaturedFiles files={files} />
        <Groups groups={groups} />
        <Topics />
      </div>
    </main>
  )
}

export default Dashboard
