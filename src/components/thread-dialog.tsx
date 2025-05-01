/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { useRouter } from 'next/navigation'
import ThreadForm from './thread-form'

export default function ThreadDialog ({
  open,
  setOpen,
  groupId
}: {
  open: boolean
  setOpen: (open: boolean) => void
  groupId: number | undefined | null
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
            <DialogTitle>Crear nuevo hilo</DialogTitle>
          </DialogHeader>
          <ThreadForm groupId={groupId} onSave={handleCloseDialog} />
        </DialogContent>
      </Dialog>
  )
}
