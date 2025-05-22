export interface AuthType {
  accessToken: string
  roles: Array<{ group_id: number, role_id: number }>
  user: string
  pic: string
  userId: number
}
