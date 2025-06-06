/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Button } from '@/components/ui/button'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { ChevronLeft, ChevronRight, Download, Folder, Heart, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { type File } from '@/types/File'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import DeleteButton from '@/components/delete-button'

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
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<string>('')
  const params = useParams()
  const fileId = params.id as string
  const URL = 'https://kw2u2431to.ufs.sh/f/'
  const { auth } = useAuth()

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
    async function checkIfLiked (fileId: number, userId: number): Promise<boolean> {
      try {
        const url = 'files/like'
        const response = await axiosPrivate.get(url + `/${fileId}/${userId}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data.isLiked
      } catch (error) {
        return false
      }
    }
    void (async () => {
      await getFile()
      if (fileId && auth.userId > 0) {
        const liked = await checkIfLiked(Number(fileId), auth.userId)
        if (isMounted) {
          setIsLiked(liked)
        }
      }
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [auth.userId, axiosPrivate, fileId])

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

  async function saveDownload (fileId: number, userId: number) {
    try {
      const url = 'files/download'
      const response = await axiosPrivate.post(url, {
        fileId,
        userId
      })
      return response.data
    } catch (error) {
    }
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
      if (file) {
        void saveDownload(file.id, auth.userId)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  async function likeFile (fileId: number, userId: number) {
    try {
      const url = 'files/like'
      const response = await axiosPrivate.post(url, {
        fileId,
        userId
      }, {
        withCredentials: true
      })
      setFile(prevFile => {
        if (prevFile) {
          return {
            ...prevFile,
            likeCount: prevFile.likeCount + 1
          }
        }
        return prevFile
      }
      )
      return response.data
    } catch (error) {
      console.log('Error liking file:', error)
    }
  }

  async function dislikeFile (fileId: number, userId: number) {
    try {
      const url = 'files/like'
      const response = await axiosPrivate.delete(url + `/${fileId}/${userId}`, {
        withCredentials: true
      })
      setFile(prevFile => {
        if (prevFile) {
          return {
            ...prevFile,
            likeCount: prevFile.likeCount > 0 ? prevFile.likeCount - 1 : 0
          }
        }
        return prevFile
      }
      )
      return response.data
    } catch (error) {
      console.log('Error disliking file:', error)
    }
  }

  async function handleDelete (fileId: number) {
    try {
      const url = 'files'
      const response = await axiosPrivate.delete(url + `/${fileId}`, {
        withCredentials: true
      })
      if (response.status === 200) {
        window.location.href = '/files'
      }
    } catch (error) {
      console.log('Error deleting file:', error)
    }
  }

  return (
    <div className='flex flex-col max-w-xl mx-auto'>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-">
          <h2 className="text-2xl font-bold tracking-tight">
            {file?.title
              ? file.title.charAt(0).toUpperCase() + file.title.slice(1)
              : ''}
            {file?.extension ? `.${file.extension}` : ''}
          </h2>
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
          {(auth.roles.some(
            role =>
            // eslint-disable-next-line eqeqeq
              role.group_id == file?.groupId &&
          // eslint-disable-next-line eqeqeq
          (role.role_id == 23 || role.role_id == 42)
          ) || (auth.userId === file?.authorId)) && (
        <DeleteButton onDelete={async () => { if (file?.id !== undefined) { await handleDelete(file.id) } }} />
          )}
      </div>
      <div className="flex justify-between items-center mb-4 mt-4">
        <div className=' flex gap-4 '>
          {file && (
            <Link href={`/user/${file.authorId}`} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={(file.userPic ? URL + file.userPic : '/placeholder.svg')} alt={file.authorUsername} />
                <AvatarFallback>{file.authorUsername.charAt(0) }</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">{'@' + file.authorUsername}</span>
            </Link>
          )}

          <Link href={`/groups/${file?.groupId}`} className="flex items-center gap-1">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground ">
              {file?.groupName
                ? file.groupName.charAt(0).toUpperCase() + file.groupName.slice(1)
                : ''}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 group"
            type="button"
            aria-label="Like"
            onClick={() => {
              void (isLiked ? dislikeFile(file?.id ?? 0, auth.userId) : likeFile(file?.id ?? 0, auth.userId))
              setIsLiked(!isLiked)
            }}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500 hover:fill-transparent hover:text-muted-foreground' : 'text-muted-foreground fill-transparent hover:text-red-500'} transition-colors duration-200`}
            />
          </button>
          <span className="text-sm text-muted-foreground">
              {file?.likeCount ?? 0}
          </span>
        </div>
      </div>

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

      {file !== null && (file.extension === 'png' || file.extension === 'jpeg' || file.extension === 'jpg') && (
        <div className='flex flex-col items-center justify-center'>
          <img
            src={URL + file.externalKey}
            alt={file.title}
            width={500}
            />
        </div>
      )}

      {file !== null && (file.extension !== 'png' && file.extension !== 'jpeg' && file.extension !== 'jpg' && file.extension !== 'pdf') && (
        <div className='flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-bold tracking-tight'>Formato no soportado</h2>
          <p className='text-sm text-muted-foreground'>El archivo {file.title}.{file.extension} no es un formato soportado para la vista previa.</p>
        </div>
      )}
    </div>
  )
}
