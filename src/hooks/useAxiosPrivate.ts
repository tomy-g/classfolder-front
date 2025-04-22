import { axiosPrivate } from '@/services/axios'
import { useEffect, useRef } from 'react'
import useRefreshToken from '@/hooks/useRefresh'
import useAuth from '@/hooks/useAuth'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import { type AxiosRequestConfig } from 'axios'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()
  const accessTokenRef = useRef(auth?.accessToken)

  useEffect(() => {
    accessTokenRef.current = auth?.accessToken
  }, [auth])

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (isNullOrUndefinedOrEmpty(config.headers.Authorization)) {
          config.headers.Authorization = `Bearer ${accessTokenRef.current}`
        }
        return config
      },
      async error => await Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          // const newAccessToken =
          const newAT = await refresh()
          console.log('newAccessToken', newAT)
          prevRequest.headers.Authorization = `Bearer ${newAT}`
          return await axiosPrivate(prevRequest as AxiosRequestConfig)
        }
        return await Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [refresh])

  return axiosPrivate
}

export default useAxiosPrivate
