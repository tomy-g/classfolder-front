import axiosLibrary from 'axios'
import axios from '@/services/axios'

interface RegisterResponse {
  id: string
  username: string
  firstName: string
  lastName: string
  error?: string
}

interface RegisterCredentials {
  username: string
  firstName: string
  lastName: string
  password: string
  pic?: string
}

class AuthService {
  private readonly apiUrl = process.env.API_URL

  async register (credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await axios.post<RegisterResponse>(
        'auth/register',
        credentials,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      if (axiosLibrary.isAxiosError(error) && error.response?.status === 409) {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Username already exists' }
      } else {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Unexpected error login in' }
      }
    }
  }

  async checkUsernameExists (username: string): Promise<boolean> {
    try {
      const response = await axios.get<boolean>(
        `auth/check-username?username=${username}`,
        {
          withCredentials: true
        }
      )
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}

const authService = new AuthService()
export default authService
