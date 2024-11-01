import axios from 'axios'

interface LoginResponse {
  id: string
  username: string
  firstName: string
  lastName: string
  error?: string
}

interface LoginCredentials {
  username: string
  password: string
}

class AuthService {
  private readonly apiUrl = 'http://localhost:4000/users'

  async login (credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${this.apiUrl}/login`,
        credentials,
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Username not found' }
      } else if (axios.isAxiosError(error) && error.response?.status === 401) {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Incorrect password' }
      } else {
        return { id: '', username: '', firstName: '', lastName: '', error: 'Unexpected error login in' }
      }
    }
  }
}

const authService = new AuthService()
export default authService
