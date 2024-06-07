import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function QuickSearch () {
  return (
    <search className='flex items-center max-w-md mx-auto my-8'>
      <div className='relative w-full'>
        <Input
          className='w-full pl-10 pr-4 py-2 rounded-md border border-foreground/75 focus:outline-none
            focus:ring-2 focus:border-primary dark:bg-secondary dark:border-foreground/25'
          placeholder='Quick search...'
          type='search'
        />
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <Search className='w-5 h-5 text-muted-foreground' />
        </div>
      </div>
    </search>
  )
}
