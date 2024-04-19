import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenu
} from '@/components/ui/dropdown-menu'
import { type JSX, type SVGProps } from 'react'

export default function Schedule () {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px] mr-auto'>
      <div className='rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950'>
        <Calendar className='w-full' initialFocus mode='single' />
      </div>
      <div className='rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950'>
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
                <DropdownMenuRadioItem value='date'>Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='title'>
                  Title
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='flex-shrink-0 rounded-md bg-gray-100 p-2 dark:bg-gray-800'>
              <CalendarIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            </div>
            <div className='flex-1'>
              <h3 className='font-medium'>Company Offsite</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                August 15, 2023 - 9:00 AM to 5:00 PM
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex-shrink-0 rounded-md bg-gray-100 p-2 dark:bg-gray-800'>
              <CalendarIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            </div>
            <div className='flex-1'>
              <h3 className='font-medium'>Team Lunch</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                August 18, 2023 - 12:00 PM to 1:30 PM
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex-shrink-0 rounded-md bg-gray-100 p-2 dark:bg-gray-800'>
              <CalendarIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            </div>
            <div className='flex-1'>
              <h3 className='font-medium'>Product Launch Meeting</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                August 22, 2023 - 2:00 PM to 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
      <line x1='16' x2='16' y1='2' y2='6' />
      <line x1='8' x2='8' y1='2' y2='6' />
      <line x1='3' x2='21' y1='10' y2='10' />
    </svg>
  )
}

function ListOrderedIcon (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='10' x2='21' y1='6' y2='6' />
      <line x1='10' x2='21' y1='12' y2='12' />
      <line x1='10' x2='21' y1='18' y2='18' />
      <path d='M4 6h1v4' />
      <path d='M4 10h2' />
      <path d='M6 18H4c0-1 2-2 2-3s-1-1.5-2-1' />
    </svg>
  )
}
