import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { CreateCharacterSchema } from '../validation/character';

export const characterRouter = express.Router();

// Créer un personnage
characterRouter.post('/', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Non authentifié' });
  const token = auth.replace('Bearer ', '');
  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    const userId = data.userId;

    // Validation d'entrée
    const parse = CreateCharacterSchema.safeParse(req.body);
    if (!parse.success) {
      const first = parse.error.errors[0];
      return res.status(400).json({ message: first.message });
    }
    const input = parse.data;

    // Si une carrière est demandée, vérifier l'âge minimum
    if (input.careerId) {
      const career = await prisma.career.findUnique({ where: { id: input.careerId } });
      if (!career) return res.status(400).json({ message: "Carrière invalide" });
      if (career.minAge && input.age && input.age < career.minAge) {
        return res.status(400).json({ message: `Trop jeune pour la carrière ${career.title} (âge minimum ${career.minAge})` });
      }
    }

    // Création
    const character = await prisma.character.create({
      data: {
        userId,
        prenom: input.prenom,
        nom: input.nom,
        surnom: input.surnom || null,
        genre: input.genre || null,
        dateNaissance: input.dateNaissance ? new Date(input.dateNaissance) : null,
        age: input.age || null,
        taille: input.taille || null,
        histoire: input.histoire || null,
        situationFamiliale: input.situationFamiliale || null,
        situationFinanciere: input.situationFinanciere || null,
        careerId: input.careerId || null,
      }
    });

    res.json({ character });
  } catch (e: any) {
    console.error('Erreur création personnage', e);
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token invalide' });
    res.status(500).json({ message: 'Erreur serveur lors de la création du personnage' });
  }
});

// Récupérer un personnage par id (protection: propriétaire ou admin)
characterRouter.get('/:id', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Non authentifié' });
  const token = auth.replace('Bearer ', '');
  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    const userId = data.userId;
    const role = data.role;
    const id = req.params.id;
    const character = await prisma.character.findUnique({ where: { id } });
    if (!character) return res.status(404).json({ message: 'Personnage introuvable' });
    if (character.userId !== userId && role !== 'ADMIN') return res.status(403).json({ message: "Accès refusé" });
    res.json({ character });
  } catch (e:any) {
    console.error('Erreur lecture personnage', e);
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Mettre à jour un personnage (propriétaire ou admin)
characterRouter.put('/:id', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Non authentifié' });
  const token = auth.replace('Bearer ', '');
  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    const userId = data.userId;
    const role = data.role;
    const id = req.params.id;
    const character = await prisma.character.findUnique({ where: { id } });
    if (!character) return res.status(404).json({ message: 'Personnage introuvable' });
    if (character.userId !== userId && role !== 'ADMIN') return res.status(403).json({ message: "Accès refusé" });

    const parse = CreateCharacterSchema.partial().safeParse(req.body);
    if (!parse.success) {
      const first = parse.error.errors[0];
      return res.status(400).json({ message: first.message });
    }
    const input = parse.data as any;

    // Si changement de carrière vérifier l'âge
    if (input.careerId) {
      const career = await prisma.career.findUnique({ where: { id: input.careerId } });
      if (!career) return res.status(400).json({ message: "Carrière invalide" });
      const targetAge = input.age ?? character.age;
      if (career.minAge && targetAge && targetAge < career.minAge) {
        return res.status(400).json({ message: `Trop jeune pour la carrière ${career.title} (âge minimum ${career.minAge})` });
      }
    }

    const updated = await prisma.character.update({ where: { id }, data: { ...input, dateNaissance: input.dateNaissance ? new Date(input.dateNaissance) : undefined } });
    res.json({ character: updated });
  } catch (e:any) {
    console.error('Erreur update personnage', e);
    res.status(401).json({ message: 'Token invalide' });
  }
});
