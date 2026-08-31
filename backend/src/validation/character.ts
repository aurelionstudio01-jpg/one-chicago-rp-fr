import { z } from 'zod'

export const CreateCharacterSchema = z.object({
  prenom: z.string().min(1, { message: 'Prénom requis' }),
  nom: z.string().min(1, { message: 'Nom requis' }),
  surnom: z.string().optional(),
  genre: z.string().optional(),
  dateNaissance: z.string().optional(), // ISO
  age: z.number().int().optional(),
  taille: z.number().optional(),
  histoire: z.string().optional(),
  situationFamiliale: z.string().optional(),
  situationFinanciere: z.any().optional(),
  careerId: z.string().optional(),
})

export type CreateCharacterInput = z.infer<typeof CreateCharacterSchema>
