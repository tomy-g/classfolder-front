import Header from '@/components/Header'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthContext from '@/context/AuthProvider'

describe('Header', () => {
  it('renders the logo sr', () => {
    render(<Header />)
    expect(screen.getByText('Class Folder')).toBeInTheDocument()
  })
  it('renders the home link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })
  it('renders the log in link or logo out link but not both', () => {
    render(<Header />)
    expect(screen.getAllByRole('link', { name: /Log in|Log out/ })).toHaveLength(1)
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
              pic: ''
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
      expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument()
    })
    it('renders the log out link', () => {
      expect(screen.getByRole('link', { name: 'Log out' })).toBeInTheDocument()
    })
    it('renders the Groups link', () => {
      expect(screen.getByRole('link', { name: 'Groups' })).toBeInTheDocument()
    })
    it('does not render the log in link', () => {
      expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument()
    })
    it('does not render the register link', () => {
      expect(screen.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument()
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
              pic: ''
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
      expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument()
    })
    it('renders the register link', () => {
      expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument()
    })
    it('does not render the profile link', () => {
      expect(screen.queryByRole('link', { name: 'Profile' })).not.toBeInTheDocument()
    })
    it('does not render the log out link', () => {
      expect(screen.queryByRole('link', { name: 'Log out' })).not.toBeInTheDocument()
    })
    it('does not render the Groups link', () => {
      expect(screen.queryByRole('link', { name: 'Groups' })).not.toBeInTheDocument()
    })
  })
})
