// High Order Component to protect routes from unauthenticated users
// and manage user session persistence

import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useRefreshToken from '@/hooks/useRefresh'
// import { type AuthType } from '@/types/Auth'

export default function withAuth (
  Component: React.ComponentType,
  ComponentAux?: React.ComponentType
) {
  return function AuthenticatedComponent (props: any) {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const { auth, persist } = useAuth()
    const router = useRouter()

    useEffect(() => {
      let isMounted = true

      async function verifyRefreshToken () {
        try {
          await refresh()
        } catch (err) {
          console.error(err)
        } finally {
          isMounted && setIsLoading(false)
        }
      }

      // Avoids unwanted call to verifyRefreshToken
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!auth?.accessToken) {
        if (persist) {
          verifyRefreshToken().catch(console.log)
        } else {
          verifyRefreshToken().catch(console.log)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }

      return () => {
        isMounted = false
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (
        (auth.accessToken == null ||
          Object.keys(auth.accessToken).length === 0 ||
          auth.accessToken === undefined) &&
        ComponentAux === undefined
      ) {
        router.push('/login') // Redirect to login if not authenticated
      }
    }, [auth.accessToken, router])

    useEffect(() => {
      console.log(`isLoading: ${isLoading}`)
      console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    if (
      auth.accessToken == null ||
      Object.keys(auth.accessToken).length === 0 ||
      auth.accessToken === undefined ||
      isLoading
    ) {
      if (ComponentAux === undefined || isLoading) {
        return null // Avoid flashing protected content
      } else {
        console.log('AQUI', auth.accessToken)
        return <ComponentAux {...props} /> // Show loading spinner
      }
    }
    return <Component {...props} />
  }
}
