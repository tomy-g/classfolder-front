import axios from '@/services/axios'
import axiosLibrary from 'axios'

class AuthService {
  private readonly apiUrl = process.env.API_URL ?? '/auth'

  async logout () {
    try {
      const response = await axios.post(
        'auth/logout',
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      if (axiosLibrary.isAxiosError(error) && error.response?.status === 204) {
        return { accessToken: '', roles: [], user: '', pic: '', error: 'Error logging out', userId: -1 }
      } else {
        return { accessToken: '', roles: [], user: '', pic: '', error: 'Unexpected error login in', userId: -1 }
      }
    }
  }
}

const authService = new AuthService()
export default authService
