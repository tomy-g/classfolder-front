import React from 'react'
import QuickSearch from '@/components/quick-search'
import Schedule from '@/components/schedule'
import { Calendar } from '@/components/ui/calendar'
import FeaturedFiles from '@/components/featured-files'
// import { type File } from '@/types/File'
import Files from '@/constants/Files'

export default function Home () {
  return (
    <main className='flex max-w-screen-2xl min-h-screen flex-col items-center pt-24 mx-auto'>
      <QuickSearch />
      <section className=' grid grid-cols-1 justify-center 2xl:grid-cols-2 w-full gap-16 mt-16'>
        <Schedule />
        <FeaturedFiles files={Files} />
        <Calendar />
        <div className=' mx-auto'>4</div>
      </section>
    </main>
  )
}
