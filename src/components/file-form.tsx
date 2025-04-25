/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { type z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Textarea } from './ui/textarea'
import { type Group } from '@/types/Group'
import { fileSchema } from '@/schemas/File'
import { UploadButton } from './upload-button'
import { type ExternalFile } from '@/types/ExternalFile'

export default function FileForm ({
  groupId,
  onSave
}: {
  groupId: number | null | undefined
  onSave: () => void
}) {
  const { auth } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string>('')
  const [externalInfo, setExternalInfo] = useState<ExternalFile>({
    extension: '',
    externalKey: ''
  })
  const axiosPrivate = useAxiosPrivate()
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      title: '',
      description: '',
      groupId: 0
    },
    mode: 'onChange'
  })

  async function createFile (data: any) {
    try {
      const response = await axiosPrivate.post('files', data, {
        withCredentials: true
      })
      console.log('respuesta: ', response)
    } catch (error) {
      console.error(error)
    }
  }

  function completeData (data: any) {
    data.authorId = auth?.userId
    data.extension = externalInfo?.extension
    data.externalKey = externalInfo?.externalKey
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (externalInfo.externalKey !== '') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      form.handleSubmit(onSubmit)()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalInfo])

  async function onSubmit (data: z.infer<typeof fileSchema>) {
    completeData(data)
    await createFile(data)
    console.log(data)
    onSave()
  }

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    async function fetchGroups (username: string): Promise<Group[]> {
      try {
        const response = await axiosPrivate.get(`groups/${username}`, {
          signal: controller.signal,
          withCredentials: true
        })
        return response.data
      } catch (error) {
        return []
      }
    }
    async function getCommunities () {
      const response = await fetchGroups(auth?.user ?? '')
      if (response.length < 1) {
        setError('No groups found')
      } else {
        setError('')
        isMounted && setGroups(response)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCommunities()
    return () => {
      isMounted = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
        {/* <UploadButton endpoint={'documentUploader'} /> */}

        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder='Ejercicios repaso examen' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='grid gap-2'>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='groupId'
          render={({ field }) => {
            const isGroupIdFixed = groupId !== null && groupId !== undefined
            return (
              <FormItem>
                <FormLabel>Grupo</FormLabel>
                {error !== '' && <p>{error}</p>}
                {error === '' && (
                  <Select
                    onValueChange={value => {
                      if (!isGroupIdFixed) {
                        field.onChange(Number(value))
                      }
                    }}
                    value={(isGroupIdFixed ? groupId : field.value)?.toString()}
                    disabled={isGroupIdFixed}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona un grupo al que perteneces' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map(group => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* <FormField
            control={form.control}
            name='groupId'
            render={({ field }) => (
                <FormItem>
                <FormLabel>Grupo</FormLabel>
                {error !== '' && <p>{error}</p>}
                {error === '' && (
                    <Select
                    onValueChange={value => {
                      field.onChange(Number(value))
                    }}
                    value={field.value?.toString()}
                    >
                    <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder='Selecciona un grupo al que perteneces' />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {groups.map(group => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                            {group.title}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
                <FormMessage />
                </FormItem>
            )}
            /> */}

        <UploadButton
          endpoint={'documentUploader'}
          content={{ allowedContent: 'pdf, docx...', button: 'Subir Archivo' }}
          disabled={!form.formState.isValid}
          onClientUploadComplete={async res => {
            console.log('res: ', res)
            setExternalInfo({
              externalKey: res[0].key,
              extension: res[0].name.split('.').pop() ?? ''
            })
            // await form.handleSubmit(onSubmit)()
          }}
        />

        <div className='flex justify-end space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              onSave()
            }}
          >
            Cancelar
          </Button>
          {/* <Button type='submit'>Publicar Archivo</Button> */}
        </div>
      </form>
    </Form>
  )
}
