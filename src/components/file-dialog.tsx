/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { useRouter } from 'next/navigation'
import FileForm from './file-form'

export default function GroupDialog ({
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
            <DialogTitle>Subir nuevo archivo</DialogTitle>
          </DialogHeader>
          <FileForm onSave={handleCloseDialog} />
        </DialogContent>
      </Dialog>
  )
}
