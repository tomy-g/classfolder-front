/* eslint-disable @typescript-eslint/no-misused-promises */
import InvitationForm from './invitation-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { useRouter } from 'next/navigation'

export default function InvitationDialog ({
  open,
  setOpen,
  groupId
}: {
  open: boolean
  setOpen: (open: boolean) => void
  groupId: number
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
          <DialogTitle>Invitar usuario al grupo</DialogTitle>
        </DialogHeader>
        <InvitationForm onSave={handleCloseDialog} group={groupId} />
      </DialogContent>
    </Dialog>
  )
}
