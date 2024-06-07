import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenu
} from '@/components/ui/dropdown-menu'
import SectionHeading from './section-heading'
import { CalendarIcon, ListOrderedIcon } from 'lucide-react'

export default function Schedule () {
  return (
    <section>
      <SectionHeading title='NEARBY SCHEDULE'></SectionHeading>
      <div className='grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_350px] mr-auto'>
        <div className='rounded-lg border p-6 shadow-sm'>
          <Calendar className='w-full' initialFocus mode='single' />
        </div>
        <div className='rounded-lg border p-6 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-medium'>Upcoming Events</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' variant='outline'>
                  <ListOrderedIcon className='mr-2 h-4 w-4' />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuRadioGroup value='date'>
                  <DropdownMenuRadioItem value='date'>
                    Date
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='title'>
                    Title
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ol className='space-y-4 list-none'>
            <li className='flex items-center gap-4'>
              <div className='flex-shrink-0 rounded-md bg-secondary/ p-2 '>
                <CalendarIcon className='h-5 w-5 text-secondary-foreground/75' />
              </div>
              <div className='flex-1'>
                <h3 className='font-medium'>Company Offsite</h3>
                <p className='text-sm text-muted-foreground'>
                  August 15, 2023 - 9:00 AM to 5:00 PM
                </p>
              </div>
            </li>
            <li className='flex items-center gap-4'>
              <div className='flex-shrink-0 rounded-md bg-secondary/ p-2 '>
                <CalendarIcon className='h-5 w-5 text-secondary-foreground/75' />
              </div>
              <div className='flex-1'>
                <h3 className='font-medium'>Team Lunch</h3>
                <p className='text-sm text-muted-foreground'>
                  August 18, 2023 - 12:00 PM to 1:30 PM
                </p>
              </div>
            </li>
            <li className='flex items-center gap-4'>
              <div className='flex-shrink-0 rounded-md bg-secondary/ p-2 '>
                <CalendarIcon className='h-5 w-5 text-secondary-foreground/75' />
              </div>
              <div className='flex-1'>
                <h3 className='font-medium'>Product Launch Meeting</h3>
                <p className='text-sm text-muted-foreground'>
                  August 22, 2023 - 2:00 PM to 4:00 PM
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
