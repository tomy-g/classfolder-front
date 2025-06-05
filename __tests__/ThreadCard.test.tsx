import React from 'react'
import { render, screen } from '@testing-library/react'
import ThreadCard from '@/components/thread-card'
import '@testing-library/jest-dom'
import { type Thread } from '@/types/Thread'

describe('ThreadCard', () => {
  const thread: Thread = {
    id: 1,
    title: 'Título del hilo',
    creatorUsername: 'usuario123',
    groupName: 'Grupo de prueba',
    messageCount: 5,
    creatorId: 0,
    groupId: 0,
    creationDate: new Date('2023-10-01T12:00:00Z'),
  }

  it('renders thread title', () => {
    render(<ThreadCard thread={thread} />)
    expect(screen.getByText('Título del hilo')).toBeInTheDocument()
  })

  it('renders creator username', () => {
    render(<ThreadCard thread={thread} />)
    expect(screen.getByText('@usuario123')).toBeInTheDocument()
  })

  it('renders group name', () => {
    render(<ThreadCard thread={thread} />)
    expect(screen.getByText('Grupo de prueba')).toBeInTheDocument()
  })

  it('renders message count', () => {
    render(<ThreadCard thread={thread} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders a link to the thread', () => {
    render(<ThreadCard thread={thread} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/threads/1')
  })
})
