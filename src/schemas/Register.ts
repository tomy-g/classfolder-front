import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres.'
  }).max(15, {
    message: 'El nombre de usuario debe tener como máximo 15 caracteres.'
  }),
  firstName: z.string().min(3, {
    message: 'El nombre debe tener al menos 3 caracteres.'
  }).max(30, {
    message: 'El nombre debe tener como máximo 30 caracteres.'
  }),
  lastName: z.string().min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.'
  }).max(30, {
    message: 'El apellido debe tener como máximo 30 caracteres.'
  }),
  password: z.string().min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.'
  }).max(100, {
    message: 'La contraseña debe tener como máximo 100 caracteres.'
  }),
  passwordConfirmation: z.string().min(8, {
    message: 'La confirmación de la contraseña debe tener al menos 8 caracteres.'
  }).max(100, {
    message: 'La confirmación de la contraseña debe tener como máximo 100 caracteres.'
  })
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Passwords must match',
})
