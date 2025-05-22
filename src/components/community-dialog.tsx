/* eslint-disable @typescript-eslint/no-misused-promises */
import CommunityForm from './community-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { useRouter } from 'next/navigation'

export default function CommunityDialog ({
  open,
  setOpen
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const router = useRouter()
  function handleCloseDialog () {
    setOpen(false)
    router.refresh()
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Crear nueva comunidad</DialogTitle>
        </DialogHeader>
        <CommunityForm onSave={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  )
}
