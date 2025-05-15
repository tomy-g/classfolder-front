/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Button } from '@/components/ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ChevronLeft, ChevronRight, Download, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { type File } from '@/types/File'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function FilePage () {
  //   const fileId = params.id
  // const fileUrl =
  //   'https://kw2u2431to.ufs.sh/f/l8OFNm5ga314khlE6AuhbXmruOsj78t6NfwS5BQWUCnzi1ZR'
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [renderNavButtons, setRenderNavButtons] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')
  const params = useParams()
  const fileId = params.id as string
  const URL = 'https://kw2u2431to.ufs.sh/f/'

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchFile (id: string): Promise<File | null> {
      try {
        const url = `files?id=${id}`
        const response = await axiosPrivate.get(url, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return null
      }
    }
    async function getFile () {
      const response = await fetchFile(fileId ?? '')
      if (response === null || response.title.length < 1) {
        setError('No se han encontrado el archivo')
      } else {
        setError('')
        isMounted && setFile(response)
      }
    }
    void (async () => {
      await getFile()
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate, fileId])

  function onDocumentLoadSuccess ({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
    setRenderNavButtons(true)
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset)
  }
  const previousPage = () => {
    changePage(-1)
  }
  const nextPage = () => {
    changePage(+1)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(URL + file?.externalKey)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = file?.title ?? 'download'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className='flex flex-col max-w-xl mx-auto'>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-">
          <h2 className="text-2xl font-bold tracking-tight">{file?.title}.{file?.extension}</h2>
          {file !== null && (
        <Button
          variant={'secondary'}
          className=''
          onClick={() => {
            void handleDownload()
          }}
        >
          <Download></Download>
          Descargar archivo
        </Button>
          )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={file?.authorAvatar ?? '/placeholder.svg'} alt={file?.authorUsername} />
              <AvatarFallback>{file?.authorUsername.charAt(0) }</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{file?.authorUsername}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{file?.group}</span>
          </div>
        </div>

      {/* PDF Viewer */}
      {file !== null && file.extension === 'pdf' && (
        <div>
          <Document file={URL + file.externalKey} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <div className='flex flex-col items-center justify-center'>
            <p className='mt-2'>
              Página {pageNumber} de {numPages}
            </p>
            {renderNavButtons && (
              <div className='mt-2 gap-4 flex'>
                <Button
                  disabled={pageNumber <= 1}
                  onClick={previousPage}
                  variant={'outline'}
                >
                  <ChevronLeft></ChevronLeft>
                </Button>
                <Button
                  disabled={pageNumber === numPages}
                  onClick={nextPage}
                  variant={'outline'}
                >
                  <ChevronRight></ChevronRight>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {file !== null && (file.extension === 'png' || file.extension === 'jpeg' || file.extension === 'jpg') && (
        <div className='flex flex-col items-center justify-center'>
          <img
            src={URL + file.externalKey}
            alt={file.title}
            width={500}
            />
        </div>
      )}

      {/* Error Handling */}
      {file !== null && (file.extension !== 'png' && file.extension !== 'jpeg' && file.extension !== 'jpg' && file.extension !== 'pdf') && (
        <div className='flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-bold tracking-tight'>Formato no soportado</h2>
          <p className='text-sm text-muted-foreground'>El archivo {file.title}.{file.extension} no es un formato soportado para la vista previa.</p>
        </div>
      )}
    </div>
  )
}
