import Link from 'next/link'
import React, { type Dispatch, type SetStateAction } from 'react'
import SearchInput from './ui/search-input'

const SectionHeading = ({ title, link, isFilterDisabled, textFilter, setTextFilter }: { title: string, link: string, isFilterDisabled: boolean, textFilter: string, setTextFilter: Dispatch<SetStateAction<string>> }) => {
  return (
    <div className='flex flex-row border-b mb-3 pb-1 mx-1 items-end justify-between'>
      <h2 className='inline-flex w-4/5'>
        <Link href={link ?? ''}>{title}</Link>
      </h2>
      <SearchInput isFilterDisabled={isFilterDisabled} textFilter={textFilter} setTextFilter={setTextFilter}></SearchInput>
    </div>
  )
}

export default SectionHeading
