import * as React from 'react'
import QuickSearch from '@/components/quick-search'
import Schedule from '@/components/schedule'
import { Calendar } from '@/components/ui/calendar'

export default function Home () {
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <QuickSearch />
      <section className=' grid grid-cols-1 2xl:grid-cols-2 w-full gap-16 mt-16'>
        <Schedule />
        <div className=' w-44'>2</div>
        {/* <div className=' mx-auto'>3</div> */}
        <Calendar />
        <div className=' mx-auto'>4</div>
      </section>
    </main>
  )
}
