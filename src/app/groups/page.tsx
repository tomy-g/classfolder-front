'use client'

import GroupsPage from '@/components/groups-page'
import withAuth from '@/hoc/withAuth'

export default function Page () {
  const AuthenticatedGroupsPage = withAuth(GroupsPage)
  return (
    <>
      <AuthenticatedGroupsPage/>
    </>
  )
}
