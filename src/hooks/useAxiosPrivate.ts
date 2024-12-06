import { axiosPrivate } from '@/services/axios'
import { useEffect } from 'react'
import useRefreshToken from '@/hooks/useRefresh'
import useAuth from '@/hooks/useAuth'
import { isNullOrUndefinedOrEmpty } from '@/utils/utils'
import { type AxiosRequestConfig } from 'axios'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (isNullOrUndefinedOrEmpty(config.headers.Authorization)) {
          config.headers.Authorization = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      async error => await Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && isNullOrUndefinedOrEmpty(prevRequest?.sent)) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return await axiosPrivate(prevRequest as AxiosRequestConfig)
        }
        return await Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
