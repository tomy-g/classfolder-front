import { z } from 'zod'

export const invitationSchema = z.object({
  invitedId: z.number().min(1, {
    message: 'El id del invitado es requerido'
  }),
//   groupId: z.number().min(1, {
//     message: 'El id del grupo es requerido'
//   }),
//   inviterId: z.number().min(1, {
//     message: 'El id del invitador es requerido'
//   })
})
