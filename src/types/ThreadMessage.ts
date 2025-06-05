export interface ThreadMessage {
  id: number
  threadId: number
  threadTitle: string
  userId: number
  username: string
  content: string
  date: Date
  userPic?: string
}
