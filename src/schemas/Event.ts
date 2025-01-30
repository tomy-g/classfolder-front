import { date, z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(2, {
    message: 'El titulo debe tener al menos 2 caracteres.'
  }).max(20, {
    message: 'El título debe tener como máximo 20 caracteres.'
  }),
  description: z.string().max(200, {
    message: 'La descripción debe tener como máximo 100 caracteres.'
  }).optional(),
  date: date().min(new Date(), {
    message: 'La fecha debe ser futura.'
  }),
  groupId: z.number().min(1, {
    message: 'El grupo debe ser válido.'
  })
})
