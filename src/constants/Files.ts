import { type File } from '@/types/File'
const files: File[] = [
  {
    id: '1',
    name: 'Document',
    author: 'John Doe',
    uploadDate: new Date('2024-04-01'),
    downloads: 100,
    extension: 'pdf'
  },
  {
    id: '2',
    name: 'Presentation',
    author: 'Jane Smith',
    uploadDate: new Date('2024-04-05'),
    downloads: 50,
    extension: 'pdf'
  },
  {
    id: '3',
    name: 'Image',
    author: 'Alice Johnson',
    uploadDate: new Date('2024-04-10'),
    downloads: 200,
    extension: 'png'
  }
]

export default files
