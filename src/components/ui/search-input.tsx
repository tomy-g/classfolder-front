import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'
import { type Dispatch, type SetStateAction } from 'react'

export default function SearchInput ({ textFilter, setTextFilter }: { textFilter: string, setTextFilter: Dispatch<SetStateAction<string>> }) {
  return (
    <div className="relative w-full max-w-56">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
      <Input
        type="text"
        placeholder="Buscar..."
        value={textFilter}
        onChange={(e) => { setTextFilter(e.target.value) }}
        className="pl-10 pr-10"
      />
      {(Boolean(textFilter)) && (
        <button
          onClick={() => { setTextFilter('') }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
