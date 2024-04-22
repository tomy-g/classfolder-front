import React from 'react'
import SectionHeading from './section-heading'
import { type Group } from '@/types/Group'
import GroupCover from './groupcover'
import { cn } from '@/lib/utils'

const Groups = ({ groups }: { groups: Group[] }) => {
  return (
    <section>
      <SectionHeading title='YOUR GROUPS'></SectionHeading>
      <ul className={cn('list-none')}>
        {groups.map((group: Group) => (
          <li key={group.id} className=''>
            <GroupCover group={group}/>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Groups
