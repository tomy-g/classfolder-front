/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ThreadsWidget from '@/components/threads-widget'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: { user: 'usuario', userId: 1 },
  }),
}))

const mockGet = jest.fn()
jest.mock('@/hooks/useAxiosPrivate', () => ({
  __esModule: true,
  default: () => ({
    get: mockGet,
  }),
}))

const mockThreads = [
  {
    id: 1,
    title: 'Primer hilo',
    creatorUsername: 'tomy',
    groupName: 'Grupo 1',
    messageCount: 10,
  },
  {
    id: 2,
    title: 'Segundo hilo',
    creatorUsername: 'ana',
    groupName: 'Grupo 2',
    messageCount: 5,
  },
]

describe('ThreadsWidget', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({ data: mockThreads })
  })

  it('renders heading', async () => {
    render(<ThreadsWidget globalFilter="" />)
    await waitFor(() => {
      expect(screen.getByText('NUEVOS HILOS')).toBeInTheDocument()
    })
  })

  it('renders threads from API', async () => {
    render(<ThreadsWidget globalFilter="" />)
    await waitFor(() => {
      expect(screen.getByText('Primer hilo')).toBeInTheDocument()
      expect(screen.getByText('Segundo hilo')).toBeInTheDocument()
    })
  })

  it('renders creator usernames', async () => {
    render(<ThreadsWidget globalFilter="" />)
    await waitFor(() => {
      expect(screen.getByText('@tomy')).toBeInTheDocument()
      expect(screen.getByText('@ana')).toBeInTheDocument()
    })
  })

  it('shows error message when no threads are returned', async () => {
    mockGet.mockReset()
    mockGet.mockResolvedValueOnce({ data: [] })

    render(<ThreadsWidget globalFilter="" />)

    await waitFor(() => {
      expect(screen.getByText(/no se han encontrado hilos/i)).toBeInTheDocument()
    })
  })
})
