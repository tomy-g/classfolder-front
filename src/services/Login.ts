import axios from '@/services/axios'
import axiosLibrary from 'axios'

interface LoginResponse {
  pic: string
  user: string
  roles: Array<{ key: number, value: number }>
  // id: string
  // username: string
  // firstName: string
  // lastName: string
  accessToken: string
  error?: string
  userId: number
}

interface LoginCredentials {
  username: string
  password: string
  persist: boolean
}

class AuthService {
  private readonly apiUrl = process.env.API_URL ?? '/auth'

  async login (credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        'auth/login',
        credentials,
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      if (axiosLibrary.isAxiosError(error) && error.response?.status === 404) {
        return { pic: '', user: '', roles: [], accessToken: '', userId: -1, error: 'Username not found' }
      } else if (axiosLibrary.isAxiosError(error) && error.response?.status === 401) {
        return { pic: '', user: '', roles: [], accessToken: '', userId: -1, error: 'Incorrect password' }
      } else {
        return { pic: '', user: '', roles: [], accessToken: '', userId: -1, error: 'Unexpected error login in' }
      }
    }
  }
}

const authService = new AuthService()
export default authService
