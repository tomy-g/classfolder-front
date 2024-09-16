import {
  MoreHorizontalIcon,
  EyeIcon,
  MessageSquare
} from 'lucide-react'
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from './ui/card'
import { type Topic } from '@/types/Topic'

const TopicCard = ({ topic }: { topic: Topic }) => {
  return (
    <Card className='mb-4' >
      <CardHeader className='flex flex-col items-start'>
        <div className='flex flex-col'>
          <CardTitle className='text-base font-semibold'>
            {topic.title}
          </CardTitle>
          <CardDescription className='text-sm leading-none mt-1'>
            by {topic.author}
          </CardDescription>
        </div>
        <span className='text-background rounded-full bg-muted-foreground text-sm px-2'>{topic.group}</span>
        <MoreHorizontalIcon className='h-5 w-5 flex-shrink-0 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='flex items-center space-x-2 text-sm'>
          <div className='ml-auto flex items-center space-x-1'>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
            <span className='text-muted-foreground'>{topic.responseCount}</span>
          </div>
          <div className='ml-auto flex items-center space-x-1'>
            <EyeIcon className='h-4 w-4 text-muted-foreground' />
            <span className='text-muted-foreground'>{topic.viewCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TopicCard
