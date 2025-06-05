import Header from '@/components/Header'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthContext from '@/context/AuthProvider'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('Header', () => {
  // it('renders the logo sr', () => {
  //   render(<Header />)
  //   expect(screen.getByText('Class Folder')).toBeInTheDocument()
  // })
  it('renders the home link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })
  it('renders the log in link or logo out link but not both', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /Iniciar sesión|Cerrar sesión/ })).toHaveLength(1)
  })

  describe('when user is logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line testing-library/no-render-in-lifecycle
      render(
        <AuthContext.Provider
          value={{
            auth: {
              accessToken: 'thisisatestaccesstoken',
              roles: [],
              user: 'testuser',
              pic: '',
              userId: 1
            },
            setAuth: () => {},
            persist: false,
            setPersist: () => {}
          }}
        >
          <Header />
        </AuthContext.Provider>
      )
    })
    it('renders the profile link', () => {
      expect(screen.getByRole('link', { name: 'Perfil' })).toBeInTheDocument()
    })
    it('renders the log out link', () => {
      expect(screen.getByRole('link', { name: 'Cerrar sesión' })).toBeInTheDocument()
    })
    it('renders the Groups link', () => {
      expect(screen.getByRole('link', { name: 'Grupos' })).toBeInTheDocument()
    })
    it('does not render the log in link', () => {
      expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
    })
    it('does not render the register link', () => {
      expect(screen.queryByRole('link', { name: 'Registro' })).not.toBeInTheDocument()
    })
  })
  describe('when user is not logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line testing-library/no-render-in-lifecycle
      render(
        <AuthContext.Provider
          value={{
            auth: {
              accessToken: '',
              roles: [],
              user: '',
              pic: '',
              userId: 1
            },
            setAuth: () => {},
            persist: false,
            setPersist: () => {}
          }}
        >
          <Header />
        </AuthContext.Provider>
      )
    })
    it('renders the log in link', () => {
      expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    })
    it('renders the register link', () => {
      expect(screen.getByRole('link', { name: 'Registro' })).toBeInTheDocument()
    })
    it('does not render the profile link', () => {
      expect(screen.queryByRole('link', { name: 'Perfil' })).not.toBeInTheDocument()
    })
    it('does not render the log out link', () => {
      expect(screen.queryByRole('link', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
    })
    it('does not render the Groups link', () => {
      expect(screen.queryByRole('link', { name: 'Grupos' })).not.toBeInTheDocument()
    })
  })
})
