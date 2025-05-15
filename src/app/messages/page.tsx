'use client'

import MessagesPage from '@/components/messages-page'
import withAuth from '@/hoc/withAuth'

export default function Page () {
  const AuthenticatedMessages = withAuth(MessagesPage)

  return (
    <>
      <AuthenticatedMessages />
    </>
  )
}
