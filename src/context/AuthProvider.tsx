'use client'
import { type AuthType } from '@/types/Auth'
import React, { createContext, useState, type ReactNode } from 'react'

interface AuthContextType {
  auth: AuthType
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>
  persist: boolean
  setPersist: React.Dispatch<React.SetStateAction<boolean>>
}

// const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AuthContext = createContext<AuthContextType>({
  auth: {
    accessToken: '',
    roles: [],
    user: '',
    pic: '',
    userId: -1
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

  const [auth, setAuth] = useState<AuthType>({ accessToken: '', roles: [], user: '', pic: '', userId: -1 })
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
