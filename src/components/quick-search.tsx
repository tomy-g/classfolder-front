import { Input } from '@/components/ui/input'
import { type JSX, type SVGProps } from 'react'

export default function QuickSearch () {
  return (
    <div className='flex items-center max-w-md mx-auto my-8'>
      <div className='relative w-full'>
        <Input
          className='w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          placeholder='Quick search...'
          type='search'
        />
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <SearchIcon className='w-5 h-5 text-gray-400' />
        </div>
      </div>
    </div>
  )
}

function SearchIcon (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  )
}
