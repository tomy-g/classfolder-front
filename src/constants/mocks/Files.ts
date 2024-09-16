import { type File } from '@/types/File'
const files: File[] = [
  {
    id: '1',
    name: 'Ejericio 3 relación 2 Física',
    author: 'John Doe',
    uploadDate: new Date('2024-04-01'),
    downloads: 100,
    extension: 'pdf',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    group: 'Física'
  },
  {
    id: '2',
    name: 'Notas de clase 4/5/2024',
    author: 'Jane Smith',
    uploadDate: new Date('2024-04-05'),
    downloads: 50,
    extension: 'txt',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    group: 'TALF'
  },
  {
    id: '3',
    name: 'UML pizarra 4/10/2024',
    author: 'Alice Johnson',
    uploadDate: new Date('2024-04-10'),
    downloads: 200,
    extension: 'png',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    group: 'Bases de datos'
  },
  {
    id: '4',
    name: 'Homework 3',
    author: 'Bob Brown',
    uploadDate: new Date('2024-04-15'),
    downloads: 75,
    extension: 'pdf',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    group: 'Matemática Discreta'
  },
  {
    id: '5',
    name: 'Aclaraciones exámen final',
    author: 'Charlie White',
    uploadDate: new Date('2024-04-20'),
    downloads: 150,
    extension: 'pdf',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    group: 'Física'
  }
]

export default files
