import axios from '@/services/axios'
import axiosLibrary from 'axios'

interface LoginResponse {
  // id: string
  // username: string
  // firstName: string
  // lastName: string
  accessToken: string
  error?: string
}

interface LoginCredentials {
  username: string
  password: string
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
        return { accessToken: '', error: 'Username not found' }
      } else if (axiosLibrary.isAxiosError(error) && error.response?.status === 401) {
        return { accessToken: '', error: 'Incorrect password' }
      } else {
        return { accessToken: '', error: 'Unexpected error login in' }
      }
    }
  }
}

const authService = new AuthService()
export default authService
