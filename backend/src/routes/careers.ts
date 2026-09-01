import express from 'express';
import { prisma } from '../prisma';

export const careersRouter = express.Router();

// Récupérer la liste des carrières
careersRouter.get('/', async (req, res) => {
  try {
    const careers = await prisma.career.findMany({ orderBy: { title: 'asc' } });
    res.json({ careers });
  } catch (e) {
    console.error('Erreur récupération carrières', e);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des carrières' });
  }
});

// Récupérer une carrière par id
careersRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const career = await prisma.career.findUnique({ where: { id } });
    if (!career) return res.status(404).json({ message: 'Carrière introuvable' });
    res.json({ career });
  } catch (e) {
    console.error('Erreur récupération carrière', e);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la carrière' });
  }
});
