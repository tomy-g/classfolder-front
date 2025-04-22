import axios from '@/services/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    try {
      const response = await axios.post('auth/refresh', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setAuth(prev => {
        return {
          ...prev,
          accessToken: response.data.accessToken,
          user: response.data.user,
          roles: response.data.roles,
          pic: response.data.pic,
          userId: response.data.userId
        }
      })
      return response.data.accessToken
    } catch (error) {
      return ''
    }
  }
  return refresh
}

export default useRefreshToken
