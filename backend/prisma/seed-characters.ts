import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const careers = [
    { id: 'career-police', title: 'Police', description: 'Agent de police', minAge: 21 },
    { id: 'career-fire', title: 'Sapeurs-pompiers', description: 'Pompier', minAge: 18 },
    { id: 'career-medical', title: 'Urgences / SAMU', description: 'Personnel médical', minAge: 18 },
    { id: 'career-civil', title: 'Civil / Métier libre', description: 'Différents métiers civils', minAge: 16 },
  ]

  for (const c of careers) {
    await prisma.career.upsert({
      where: { id: c.id },
      update: { title: c.title, description: c.description, minAge: c.minAge },
      create: { id: c.id, title: c.title, description: c.description, minAge: c.minAge },
    })
  }

  console.log('Seed careers completed')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
