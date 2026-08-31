import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  console.log('Seed démarré...');
  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@onechicago.local' },
    update: {},
    create: {
      email: 'admin@onechicago.local',
      password: await (await import('bcrypt')).hash('changeme', 10),
      displayName: 'Admin',
      role: 'ADMIN'
    }
  });

  const player = await prisma.user.upsert({
    where: { email: 'joueur@onechicago.local' },
    update: {},
    create: {
      email: 'joueur@onechicago.local',
      password: await (await import('bcrypt')).hash('changeme', 10),
      displayName: 'Joueur Test'
    }
  });

  // Carrières
  const police = await prisma.career.upsert({ where: { key: 'policier' }, update: {}, create: { key: 'policier', title: 'Policier', category: 'POLICE', salary: 3000, skills: {}, equipment: {} } });
  const pompier = await prisma.career.upsert({ where: { key: 'pompier' }, update: {}, create: { key: 'pompier', title: 'Pompier', category: 'POMPIERS', salary: 2800, skills: {}, equipment: {} } });
  const ambulancier = await prisma.career.upsert({ where: { key: 'ambulancier' }, update: {}, create: { key: 'ambulancier', title: 'Ambulancier', category: 'MEDICAL', salary: 2600, skills: {}, equipment: {} } });

  // Lieux
  await prisma.location.upsert({ where: { name: 'Commissariat Central' }, update: {}, create: { name: 'Commissariat Central', type: 'commissariat' } });
  await prisma.location.upsert({ where: { name: 'Caserne Centrale' }, update: {}, create: { name: 'Caserne Centrale', type: 'caserne' } });
  await prisma.location.upsert({ where: { name: 'Hôpital Général' }, update: {}, create: { name: 'Hôpital Général', type: 'hopital' } });
  await prisma.location.upsert({ where: { name: 'Centre-ville' }, update: {}, create: { name: 'Centre-ville', type: 'centre' } });

  // PNJ personnages de démonstration
  await prisma.character.upsert({ where: { id: 'npc-1' }, update: {}, create: { id: 'npc-1', userId: player.id, prenom: 'Martin', nom: 'Dupont', age: 34, genre: 'M', histoire: 'PNJ de démonstration' } });
  await prisma.character.upsert({ where: { id: 'npc-2' }, update: {}, create: { id: 'npc-2', userId: player.id, prenom: 'Sophie', nom: 'Leroy', age: 28, genre: 'F', histoire: 'PNJ de démonstration' } });

  console.log('Seed terminé');
}

seed().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
