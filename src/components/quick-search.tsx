import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { type Dispatch, type SetStateAction } from 'react'

export default function QuickSearch ({ globalFilter, setGlobalFilter }: { globalFilter: string, setGlobalFilter: Dispatch<SetStateAction<string>> }) {
  return (
    <search className='flex items-center max-w-md mx-auto my-8'>
      <div className='relative w-full'>
        <Input
          className='w-full pl-10 pr-4 py-2 rounded-md border border-foreground/75 focus:outline-none
            focus:ring-2 focus:border-primary dark:bg-secondary dark:border-foreground/25'
          placeholder='Busqueda rápida...'
          type='text'
          value={globalFilter}
          onChange={(e) => { setGlobalFilter(e.target.value) }}
        />
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <Search className='w-5 h-5 text-muted-foreground' />
        </div>
        {(Boolean(globalFilter)) && (
          <button
            onClick={() => { setGlobalFilter('') }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </search>
  )
}
