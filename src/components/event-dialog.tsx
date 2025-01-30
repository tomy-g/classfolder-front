/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import EventForm from './event-form'
import { useRouter } from 'next/navigation'

export default function EventDialog ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter()
  function handleCloseDialog () {
    setOpen(false)
    router.refresh()
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Crear nuevo evento de clase</DialogTitle>
          <DialogDescription>
            El nuevo evento se añadirá al grupo seleccionado.
          </DialogDescription>
        </DialogHeader>
        <EventForm onSave={handleCloseDialog}/>
      </DialogContent>
    </Dialog>
  )
}
