import React, { useEffect, useState } from 'react';

type Career = {
  id: string;
  title: string;
  description?: string;
  minAge?: number | null;
}

export default function CreateCharacterPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState<number>(18);
  const [careerId, setCareerId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/careers')
      .then(r => r.json())
      .then(data => {
        setCareers(data.careers || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setError('Impossible de récupérer la liste des carrières.');
        setLoading(false);
      });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!prenom.trim() || !nom.trim()) {
      setMessage('Prénom et nom requis.');
      return;
    }

    // Vérifier l'âge minimal pour la carrière sélectionnée
    const chosen = careers.find(c => c.id === careerId);
    if (chosen && chosen.minAge && age < chosen.minAge) {
      setMessage(`Vous êtes trop jeune pour la carrière ${chosen.title} (âge minimum ${chosen.minAge}).`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Vous devez être connecté pour créer un personnage.');
      return;
    }

    fetch('/api/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ prenom, nom, age, careerId }),
    })
      .then(async res => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || 'Erreur');
        setMessage('Personnage créé avec succès.');
        // Optionnel: rediriger vers la fiche personnage
      })
      .catch(err => {
        console.error(err);
        setMessage(typeof err === 'string' ? err : (err.message || 'Erreur lors de la création du personnage'));
      });
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1>Création de personnage</h1>
      <p>Complétez les champs pour créer votre personnage. Tous les messages sont en français.</p>

      {loading && <p>Chargement des carrières…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Prénom</label>
          <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Prénom" />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Nom</label>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Âge: {age} ans</label>
          <input type="range" min={12} max={80} value={age} onChange={e => setAge(Number(e.target.value))} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Carrière souhaitée</label>
          <select value={careerId ?? ''} onChange={e => setCareerId(e.target.value || null)}>
            <option value="">Aucune</option>
            {careers.map(c => (
              <option key={c.id} value={c.id}>{c.title}{c.minAge ? ` (âge min ${c.minAge})` : ''}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="submit">Créer</button>
        </div>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}

      <hr />
      <p>Conseils : utilisez un navigateur moderne. Si vous êtes trop jeune pour un métier, changez l'âge ou sélectionnez une autre carrière.</p>
    </div>
  );
}
