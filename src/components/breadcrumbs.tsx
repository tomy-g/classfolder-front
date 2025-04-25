/* eslint-disable @typescript-eslint/strict-boolean-expressions */
'use client'

import { Fragment, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { type Group } from '@/types/Group'

const Breadcrumbs = () => {
  const pathname = usePathname()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')
  const [group, setGroup] = useState<Group>()

  useEffect(() => {
    let isMounted = true

    const segments = pathname.split('/').filter(Boolean)
    const groupIndex = segments.findIndex(s => s === 'groups')

    if (
      groupIndex !== -1 &&
      segments.length > groupIndex + 1 &&
      segments[groupIndex + 1].length > 0
    ) {
      const groupId = segments[groupIndex + 1]
      const controller = new AbortController()
      async function fetchGroup (username: string): Promise<Group | null> {
        try {
          const response = await axiosPrivate.get(`groups?id=${groupId}`, {
            signal: controller.signal,
            withCredentials: true
          })
          return response.data
        } catch (error) {
          return null
        }
      }

      async function getGroup () {
        const response = await fetchGroup(auth?.user ?? '')
        if (!response || response.title.length === 0) {
          setError('No groups found')
        } else {
          setError('')
          isMounted && setGroup(response)
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getGroup()
      return () => {
        isMounted = false
        controller.abort()
      }
    }
  }, [auth?.user, axiosPrivate, pathname])

  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    let name = segment.replace(/-/g, ' ')
    const href = '/' + segments.slice(0, index + 1).join('/')

    // Replace group ID with title
    if (segments[index - 1] === 'groups' && group?.title) {
      name = group.title
    }

    return { name, href }
  })

  const fullBreadcrumbs = [{ name: 'Home', href: '/' }, ...breadcrumbs]

  return (
    <Breadcrumb className='px-10 max-w-screen-3xl mx-auto h-10 flex items-center mt-8'>
      {error !== '' && <p>{error}</p>}

      <BreadcrumbList >
        {fullBreadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={crumb.href} className='mb-1'>
                {crumb.name.charAt(0).toUpperCase() + crumb.name.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < fullBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs
