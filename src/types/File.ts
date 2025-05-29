type FileExtension = 'pdf' | 'doc' | 'png' | 'csv' | 'xls' | 'jpeg' | 'jpg' | 'txt'

export interface File {
  id: number
  title: string
  authorId: number
  authorUsername: string
  uploadDate: Date
  downloadCount: number
  likeCount: number
  extension: FileExtension
  userPic: string
  groupName: string
  groupId: number
  externalKey: string
}
