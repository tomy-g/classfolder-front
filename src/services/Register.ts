import axios from 'axios'

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
}

class AuthService {
  private readonly apiUrl = 'http://localhost:4000/users'

  async register (credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await axios.post<RegisterResponse>(
        `${this.apiUrl}/register`,
        credentials,
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Username already exists' }
      } else {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Unexpected error login in' }
      }
    }
  }

  async checkUsernameExists (username: string): Promise<boolean> {
    try {
      const response = await axios.get<boolean>(
        `${this.apiUrl}?username=${username}`,
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      return false
    }
  }
}

const authService = new AuthService()
export default authService
