import { useState, useEffect } from 'react'
import './App.css'

interface GameStatus {
  status: string
  message: string
  version: string
}

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGameStatus()
  }, [])

  const fetchGameStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/health')
      const data = await response.json()
      setGameStatus(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server')
      setGameStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚨 ONE CHICAGO RP 🚨</h1>
        <p>Simulation RP français inspirée des services d'urgence</p>
      </header>

      <main className="app-main">
        <section className="status-card">
          <h2>État du Serveur</h2>
          
          {loading && <p className="loading">Connexion en cours...</p>}
          
          {error && (
            <div className="error">
              <p>⚠️ Erreur de connexion</p>
              <p>{error}</p>
              <button onClick={fetchGameStatus}>Réessayer</button>
            </div>
          )}
          
          {gameStatus && (
            <div className="status-info">
              <div className="status-item">
                <label>Statut:</label>
                <span className="status-badge success">{gameStatus.status}</span>
              </div>
              <div className="status-item">
                <label>Message:</label>
                <span>{gameStatus.message}</span>
              </div>
              <div className="status-item">
                <label>Version:</label>
                <span>{gameStatus.version}</span>
              </div>
            </div>
          )}
        </section>

        <section className="features-card">
          <h2>Fonctionnalités à venir</h2>
          <ul>
            <li>✅ Gestion des personnages</li>
            <li>✅ Système de métier (Police, Pompiers, EMS)</li>
            <li>✅ Gestion des appels d'urgence</li>
            <li>✅ Chat en direct</li>
            <li>✅ Système de faction</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>ONE CHICAGO RP v1.0.0 - Phase 1 Scaffold</p>
      </footer>
    </div>
  )
}

export default App
