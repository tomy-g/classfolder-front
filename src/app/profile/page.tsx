'use client'
import UserProfile from '@/components/UserProfile'
import withAuth from '@/hoc/withAuth'

export default function Page () {
  const AuthenticatedUserProfile = withAuth(UserProfile)

  return (
    <>
      <AuthenticatedUserProfile/>
    </>
  )
}
