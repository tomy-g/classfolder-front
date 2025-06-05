/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import GroupsWidget from '@/components/groups-widget'
import '@testing-library/jest-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'

jest.mock('@/hooks/useAxiosPrivate', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn()
}))

describe('GroupsWidget', () => {
  const mockAxios = jest.fn()
  const mockUser = { user: 'mockuser' }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAxiosPrivate as jest.Mock).mockReturnValue({ get: mockAxios })
    ;(useAuth as jest.Mock).mockReturnValue({ auth: mockUser })
  })

  it('shows error message when no groups are returned', async () => {
    mockAxios.mockResolvedValueOnce({ data: [] })

    render(<GroupsWidget globalFilter="" />)

    await waitFor(() => {
      expect(screen.getByText(/no groups found/i)).toBeInTheDocument()
    })
  })

  it('renders a list of groups with titles', async () => {
    const groups = [
      {
        id: '1',
        title: 'Grupo A',
        description: 'Descripción A',
        creationDate: '2024-06-01',
        communityId: null
      },
      {
        id: '2',
        title: 'Grupo B',
        description: 'Descripción B',
        creationDate: '2024-06-01',
        communityId: 1
      }
    ]

    mockAxios.mockResolvedValueOnce({ data: groups })

    render(<GroupsWidget globalFilter="" />)

    for (const group of groups) {
      await waitFor(() => {
        expect(screen.getByText(group.title)).toBeInTheDocument()
      })
    }
  })

  it('renders "Añadir grupo" and "Ver todos" buttons', async () => {
    mockAxios.mockResolvedValueOnce({ data: [] })

    render(<GroupsWidget globalFilter="" />)

    await waitFor(() => {
      expect(screen.getByText(/añadir grupo/i)).toBeInTheDocument()
      expect(screen.getByText(/ver todos/i)).toBeInTheDocument()
    })
  })
})
