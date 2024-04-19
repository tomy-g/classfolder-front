type FileExtension = 'pdf' | 'doc' | 'png' | 'csv' | 'xls' | 'jpeg'

export interface File {
  id: string
  name: string
  author: string
  uploadDate: Date
  downloads: number
  extension: FileExtension
}
