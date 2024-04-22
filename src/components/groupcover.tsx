import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'
import { type Group } from '@/types/Group'
import { cn } from '@/lib/utils'

const GroupCover = ({ group }: { group: Group }) => {
  const bgColor = getBgColor(group.color)

  function getBgColor (color: string) {
    switch (color) {
      case 'blue':
        return 'bg-blue-500'
      case 'pink':
        return 'bg-pink-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'teal':
        return 'bg-teal-500'
      case 'orange':
        return 'bg-orange-500'
      case 'green':
        return 'bg-green-500'
    }
  }

  return (
    <Card className={cn('w-1/3 aspect-square', bgColor)}>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default GroupCover
