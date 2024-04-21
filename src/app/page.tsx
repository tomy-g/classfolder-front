import React from 'react'
import QuickSearch from '@/components/quick-search'
import Schedule from '@/components/schedule'
import { Calendar } from '@/components/ui/calendar'
import FeaturedFiles from '@/components/featured-files'
// import { type File } from '@/types/File'
import Files from '@/constants/Files'

export default function Home () {
  return (
    <main className='flex w-full max-w-screen-3xl min-h-screen flex-col items-center pt-24 px-10 mx-auto'>
      <QuickSearch />
      <div className='grid lg:grid-cols-2 gap-16 mt-16 w-full justify-center'>
        <Schedule />
        <FeaturedFiles files={Files} />
        <Calendar />
        <div className=' mx-auto'>4</div>
      </div>
    </main>
  )
}
