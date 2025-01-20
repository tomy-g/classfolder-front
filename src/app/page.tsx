'use client'

import Dashboard from '@/components/dash-board'
import Landing from '@/components/Landing'
import withAuth from '@/hoc/withAuth'

const AuthenticatedDashboard = withAuth(Dashboard, Landing)

function Home () {
  return <AuthenticatedDashboard />
}

export default Home
