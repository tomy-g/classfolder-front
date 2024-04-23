import React from 'react'
import SectionHeading from './section-heading'
import { type Group } from '@/types/Group'
import GroupCover from './group-cover'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

const Groups = ({ groups }: { groups: Group[] }) => {
  return (
    <section>
      <SectionHeading title='YOUR GROUPS'></SectionHeading>
      <ul className={'list-none grid grid-cols-2 gap-6 xl:grid-cols-3'}>
        {groups.map((group: Group) => (
          <li key={group.id}>
            <GroupCover group={group} />
          </li>
        ))}
        <li key='buttons' className=' flex flex-col'>
          <Button size='lg' variant='outline' className='rounded-lg'>Add group</Button>
          <Separator className=' my-3' />
          <Button size='lg' variant='secondary' className='rounded-lg'>View all</Button>
        </li>
      </ul>
    </section>
  )
}

export default Groups
