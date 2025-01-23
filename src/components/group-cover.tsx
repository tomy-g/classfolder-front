import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'
import { type Group } from '@/types/Group'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const GroupCover = ({ group }: { group: Group }) => {
  return (
    <Link href={`/group/${group.id}`}>
    <Card className={cn('aspect-square rounded-3xl w-full')}>
      <CardHeader>
        <CardTitle>{group.title}</CardTitle>
      </CardHeader>
    </Card>
    </Link>
  )
}

export default GroupCover
