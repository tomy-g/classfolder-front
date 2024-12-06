'use client'
import withAuth from '@/hoc/withAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function DashboardPage () {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const axiosPrivate = useAxiosPrivate()
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController()
    const isMounted = { current: true } // Using an object for reliable reference

    const getUsers = async () => {
      setLoading(true)
      try {
        const response = await axiosPrivate.get('/users', {
          signal: controller.signal
        })
        if (isMounted.current && Array.isArray(response.data)) {
          setUsers(response.data)
        }
      } catch (err) {
        console.error('Error encontrado')
        if (isMounted.current) {
          router.push('/login')
        }
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    void getUsers()

    return () => {
      isMounted.current = false // Mark as unmounted
      controller.abort() // Clean up the ongoing request
    }
  }, [axiosPrivate, router])

  return (
    <article>
      <h2>Users List</h2>
      {loading
        ? (
        <p>Loading...</p>
          )
        : users?.length !== 0
          ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
            )
          : (
        <p>No users to display</p>
            )}
    </article>
  )
}

export default withAuth(DashboardPage)
