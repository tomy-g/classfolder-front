/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilesWidget from '@/components/files-widget'
import AuthContext from '@/context/AuthProvider'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

jest.mock('@/hooks/useAxiosPrivate', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn()
  })
}))

const mockAxios = {
  get: jest.fn()
}

const mockFile = {
  id: 1,
  title: 'archivo de prueba',
  extension: 'pdf',
  authorId: 2,
  authorUsername: 'usuario',
  userPic: '',
  groupName: 'grupo1',
  groupId: 3,
  uploadDate: new Date().toISOString(),
  downloadCount: 12,
  likeCount: 7
}

describe('FilesWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAxiosPrivate as jest.Mock).mockReturnValue(mockAxios)
  })

  const renderWithAuth = (responseData: any, globalFilter = '', groupId?: number) => {
    mockAxios.get.mockResolvedValueOnce({ data: responseData })

    return render(
      <AuthContext.Provider
        value={{
          auth: {
            accessToken: 'token',
            roles: [],
            user: 'tester',
            userId: 1,
            pic: ''
          },
          setAuth: () => {},
          persist: false,
          setPersist: () => {}
        }}
      >
        <FilesWidget globalFilter={globalFilter} groupId={groupId} />
      </AuthContext.Provider>
    )
  }

  it('renders section title', async () => {
    renderWithAuth([mockFile])
    await waitFor(() => {
      expect(screen.getByText('ARCHIVOS DESTACADOS')).toBeInTheDocument()
    })
  })

  it('renders file card when data is returned', async () => {
    renderWithAuth([mockFile])
    await waitFor(() => {
      expect(screen.getByText('Archivo de prueba')).toBeInTheDocument()
      expect(screen.getByText('@usuario')).toBeInTheDocument()
      expect(screen.getByText('Grupo1')).toBeInTheDocument()
    })
  })

  it('shows error message if no files found', async () => {
    renderWithAuth([])
    await waitFor(() => {
      expect(screen.getByText('No se han encontrado archivos')).toBeInTheDocument()
    })
  })

  it('renders "Nuevo archivo" button', async () => {
    renderWithAuth([])
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /nuevo archivo/i })).toBeInTheDocument()
    })
  })
})
