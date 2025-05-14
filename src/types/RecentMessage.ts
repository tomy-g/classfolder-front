export interface RecentMessage {
  id?: number
  userId: number
  username: string
  userPic: string
  content: string
  isReceived: boolean
  date: Date
}

export interface CreatingMessage {
  sender: number
  receiver: number
  content: string
  date: Date
}
