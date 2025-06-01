'use client'

import SchedulePage from '@/components/schedule-page'
import withAuth from '@/hoc/withAuth'

export default function Page () {
  const AuthenticatedSchedulePage = withAuth(SchedulePage)
  return (
    <>
      <AuthenticatedSchedulePage/>
    </>
  )
}
