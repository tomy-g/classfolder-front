import React from 'react'
import Topic from './topic'
import SectionHeading from './section-heading'

const Topics = () => {
  return (
    <section>
        <SectionHeading title={'NEW TOPICS'}/>
      <ul>
        <Topic></Topic>
        <Topic></Topic>
        <Topic></Topic>
      </ul>
    </section>
  )
}

export default Topics
