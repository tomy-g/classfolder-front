import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'
import { type Group } from '@/types/Group'
import { cn, mapColor } from '@/lib/utils'

const GroupCover = ({ group }: { group: Group }) => {
  const bgColor: string = mapColor(group.color)

  return (
    <Card className={cn('aspect-square rounded-3xl w-full', bgColor)}>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default GroupCover
