import { z } from 'zod'

export const registerSchema = z.object({
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
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  }).max(100, {
    message: 'Password must be at most 100 characters.'
  }),
  passwordConfirmation: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  }).max(100, {
    message: 'Password must be at most 100 characters.'
  })
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Passwords must match',
})
