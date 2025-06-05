/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FileCard from '@/components/file-card'
import React from 'react'
import { type File } from '@/types/File'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}))

const baseFile: File = {
  id: 1,
  title: 'archivo de prueba',
  extension: 'pdf',
  authorId: 2,
  authorUsername: 'usuario',
  userPic: '',
  groupName: 'grupo1',
  groupId: 3,
  uploadDate: new Date(),
  downloadCount: 12,
  likeCount: 7,
  externalKey: 'mock-external-key'
}

describe('FileCard', () => {
  it('renders title capitalized', () => {
    render(<FileCard file={baseFile} />)
    expect(screen.getByText('Archivo de prueba')).toBeInTheDocument()
  })

  it('renders author username with @', () => {
    render(<FileCard file={baseFile} />)
    expect(screen.getByText('@usuario')).toBeInTheDocument()
  })

  it('renders group name capitalized', () => {
    render(<FileCard file={baseFile} />)
    expect(screen.getByText('Grupo1')).toBeInTheDocument()
  })

  it('renders correct download and like counts', () => {
    render(<FileCard file={baseFile} />)
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders the formatted date correctly', () => {
    const customDate = new Date('2024-04-15T00:00:00Z')
    render(<FileCard file={{ ...baseFile, uploadDate: customDate }} />)
    expect(screen.getByText((text) => text.includes('15 de abril'))).toBeInTheDocument()
  })

  it('renders correct icon for pdf extension', () => {
    render(<FileCard file={{ ...baseFile, extension: 'pdf' }} />)
    expect(document.querySelector('.text-red-500')).toBeInTheDocument()
  })

  it('renders correct icon for image extension', () => {
    render(<FileCard file={{ ...baseFile, extension: 'png' }} />)
    expect(document.querySelector('.text-blue-500')).toBeInTheDocument()
  })
})
