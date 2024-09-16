import React from 'react'
import SectionHeading from './section-heading'
import topics from '@/constants/mocks/Topics'
import { type Topic } from '@/types/Topic'
import TopicCard from './topic-card'

const Topics = () => {
  return (
    <section>
        <SectionHeading title={'NEW TOPICS'}/>
      <ul>
      {topics.map((topic: Topic) => (
          <li key={topic.id}>
            <TopicCard topic={topic} />
          </li>
      ))}
      </ul>
    </section>
  )
}

export default Topics
