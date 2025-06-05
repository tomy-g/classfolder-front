import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableItemProps {
  id: string
  children: React.ReactNode
}

export default function SortableItem ({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative border rounded-lg bg-background transition-border
        ${isOver ? 'border-primary shadow-md' : 'border-transparent'} `}>
      <div
        className="absolute top-7 left-2 cursor-grab z-10"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="pl-8 pr-2 pt-2">{children}</div>
    </div>
  )
}
