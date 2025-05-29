'use client'
import UserPage from '@/components/user-page'
import withAuth from '@/hoc/withAuth'

export default function Page () {
  const AuthenticatedUserProfile = withAuth(UserPage)

  return (
    <>
      <AuthenticatedUserProfile/>
    </>
  )
}
