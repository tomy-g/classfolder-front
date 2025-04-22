import { z } from 'zod'

export const userSchema = z.object({
  id: z.number().min(1, {
    message: 'El id debe ser válido.'
  }),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.'
  }).max(15, {
    message: 'Username must be at most 15 characters.'
  }),
  firstName: z.string().min(3, {
    message: 'First name must be at least 3 characters.'
  }).max(30, {
    message: 'First name must be at most 30 characters.'
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 3 characters.'
  }).max(30, {
    message: 'Last name must be at most 30 characters.'
  })
})
