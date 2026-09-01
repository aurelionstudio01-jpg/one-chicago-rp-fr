import request from 'supertest'
import { prisma } from '../src/prisma'
// NOTE: Assumes your express app is exported from src/app.ts as default
import app from '../src/app'

describe('Characters API', () => {
  beforeAll(async () => {
    // Optionnel: préparer DB (clear test data)
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('Create character requires auth', async () => {
    const res = await request(app).post('/api/characters').send({ prenom: 'Test', nom: 'User' })
    expect(res.status).toBe(401)
  })

  // Test minimal qui devra être étendu selon l'implémentation de l'auth
})
