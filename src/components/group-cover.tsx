import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'
import { type Group } from '@/types/Group'
import { cn } from '@/lib/utils'

const GroupCover = ({ group }: { group: Group }) => {
  return (
    <Card className={cn('aspect-square rounded-3xl w-full')}>
      <CardHeader>
        <CardTitle>{group.title}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default GroupCover
