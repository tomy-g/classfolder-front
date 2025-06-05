/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, waitFor } from '@testing-library/react'
import RankingWidget from '@/components/ranking-widget'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type User } from '@/types/User'
import '@testing-library/jest-dom'

jest.mock('@/hooks/useAxiosPrivate')
const mockedAxiosPrivate = useAxiosPrivate as jest.Mock

const mockUsers: User[] = [
  {
    id: 1,
    username: 'alice',
    firstName: 'Alice',
    lastName: 'Smith',
    pic: null,
    totalScore: 1500
  },
  {
    id: 2,
    username: 'bob',
    firstName: 'Bob',
    lastName: 'Jones',
    pic: null,
    totalScore: 1200
  },
  {
    id: 3,
    username: 'carol',
    firstName: 'Carol',
    lastName: 'White',
    pic: null,
    totalScore: 1100
  }
]

describe('RankingWidget', () => {
  it('renders ranked users correctly', async () => {
    mockedAxiosPrivate.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockUsers })
    })

    render(<RankingWidget groupId={1} />)

    await waitFor(() => {
      expect(screen.getByText('@alice')).toBeInTheDocument()
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
      expect(
        screen.getByText((content, node) =>
          node?.textContent === '1500 pts'
        )
      ).toBeInTheDocument()
    })

    expect(screen.getByText('@bob')).toBeInTheDocument()
    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
    expect(
      screen.getByText((content, node) =>
        node?.textContent === '1200 pts'
      )
    ).toBeInTheDocument()

    expect(screen.getByText('@carol')).toBeInTheDocument()
    expect(screen.getByText('Carol White')).toBeInTheDocument()
    expect(
      screen.getByText((content, node) =>
        node?.textContent === '1100 pts'
      )
    ).toBeInTheDocument()
  })

  it('shows no users if backend returns empty array', async () => {
    mockedAxiosPrivate.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: [] })
    })

    render(<RankingWidget groupId={1} />)

    await waitFor(() => {
      expect(screen.queryByText(/@/)).not.toBeInTheDocument()
    })
  })
})
