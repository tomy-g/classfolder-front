'use client'
import React, { createContext, useState, type ReactNode } from 'react'

interface AuthContextType {
  auth: { accessToken: string }
  setAuth: React.Dispatch<React.SetStateAction<{ accessToken: string }>>
  persist: boolean
  setPersist: React.Dispatch<React.SetStateAction<boolean>>
}

// const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AuthContext = createContext<AuthContextType>({
  auth: {
    accessToken: ''
  },
  setAuth: () => {},
  persist: false,
  setPersist: () => {}
})

// FIXME: Not sure if this works

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  async function getPersitance () {
    return JSON.parse(localStorage.getItem('persist') ?? 'false') as boolean
  }

  const [auth, setAuth] = useState({ accessToken: '' })
  const [persist, setPersist] = useState(false)

  React.useEffect(() => {
    async function fetchPersist () {
      const inLocalStorage = await getPersitance()
      setPersist(inLocalStorage)
    }
    fetchPersist().catch(error => {
      console.error('Failed to fetch persistence:', error)
    })
  }, [])
  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
