'use client'
import GroupDashboard from '@/components/group-dashboard'
import withAuth from '@/hoc/withAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page ({ params }: { params: Promise<{ id: number }> }) {
  const router = useRouter()
  const [id, setId] = useState<number | null>(null)

  useEffect(() => {
    async function awaitId () {
      const par = await params
      const idP = par.id
      return idP
    }
    awaitId().then(idReturned => {
      setId(idReturned)
      if (isNaN(idReturned)) {
        router.push('/404')
      }
    }).catch(error => {
      console.error(error)
      router.push('/404')
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const AuthenticatedGroupDashboard = withAuth(GroupDashboard)

  return (
    <>
      {id !== null && <AuthenticatedGroupDashboard groupId={id} />}
    </>
  )
}
