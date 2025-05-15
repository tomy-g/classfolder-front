type FileExtension = 'pdf' | 'doc' | 'png' | 'csv' | 'xls' | 'jpeg' | 'jpg' | 'txt'

export interface File {
  id: number
  title: string
  authorId: number
  authorUsername: string
  uploadDate: Date
  downloads: number
  extension: FileExtension
  authorAvatar: string
  group: string
  externalKey: string
}
