import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: 'El nombre de usuario debe tener al menos 2 caracteres.'
  }).max(15, {
    message: 'El nombre de usuario debe tener como máximo 15 caracteres.'
  }),
  password: z.string().min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.'
  }).max(100, {
    message: 'La contraseña debe tener como máximo 100 caracteres.'
  }),
  persist: z.boolean()
})
