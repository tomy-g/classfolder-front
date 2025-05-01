import { z } from 'zod'

export const threadSchema = z.object({
  title: z.string().min(2, {
    message: 'El titulo debe tener al menos 2 caracteres.'
  }).max(20, {
    message: 'El título debe tener como máximo 20 caracteres.'
  }),
  message: z.string().min(30, {
    message: 'La descripción debe tener al menos 30 caracteres.'
  }),
  groupId: z.number().min(1, {
    message: 'El grupo debe ser válido.'
  })
})
