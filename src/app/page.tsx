import React from 'react'
import QuickSearch from '@/components/quick-search'
import Schedule from '@/components/schedule'
import FeaturedFiles from '@/components/featured-files'
import files from '@/constants/mocks/Files'
import Groups from '@/components/groups'
import groups from '@/constants/mocks/Groups'

export default function Home () {
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center px-10 mx-auto'>
      <QuickSearch />
      <div className='grid lg:grid-cols-2 gap-16 mt-16 w-full justify-center'>
        <Schedule />
        <FeaturedFiles files={files} />
        <Groups groups={groups}/>
        <div className='mx-auto'>4G</div>
      </div>
    </main>
  )
}
