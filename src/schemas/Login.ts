import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }).max(15, {
    message: 'Username must be at most 15 characters.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  }).max(100, {
    message: 'Password must be at most 100 characters.'
  })
})
