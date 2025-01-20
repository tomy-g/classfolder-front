'use client'

// import EventCalendar from '@/components/EventCalendar'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarPlus } from 'lucide-react'

export default function Page () {
  return (
    <div className='flex my-8 w-full items-center justify-center px-4 flex-col gap-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <CalendarPlus/>
            Nuevo evento
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Crea un nuevo Evento de Grupo</DialogTitle>
            <DialogDescription>
              Añade un nuevo envento de grupo, este se mostrará a todos los miembros del grupo seleccionado.
              <br/>
              <br/>
              Ejemplo: Fecha de examen, clase destacada, entrega de proyecto...
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='title' className='text-right'>
                Titulo
              </Label>
              <Input id='title' placeholder='Examen de matemáticas' defaultValue={''} className='col-span-3' />
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='description' className='text-right'>
                Descripción
              </Label>
              <Textarea id='description' placeholder='El examen será en el aula 3.1' defaultValue={''} className='col-span-3'/>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='group' className='text-right'>
                Grupo
              </Label>
              <Select>
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>
                <SelectContent id='group'>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='fecha' className='text-right'>
                Fecha
              </Label>
              <div id='fecha'>
                <DateTimePicker placeholder='Selecciona fecha y hora' />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <EventCalendar /> */}
    </div>
  )
}
