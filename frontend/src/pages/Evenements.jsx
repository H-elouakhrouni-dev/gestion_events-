import { useState, useEffect, useCallback } from 'react';
import api, { formatApiError } from '../api';
import { useAuth } from '../context/AuthContext';

const FILTER_OPTIONS = [
  { id: 'tous', label: 'Tous' },
  { id: 'ouvert', label: 'Ouverts' },
  { id: 'complet', label: 'Complets' },
  { id: 'archive', label: 'Archivés' },
  { id: 'annule', label: 'Annulés' },
];

function clampParticipants(value) {
  return Math.max(0, parseInt(value, 10) || 0);
}

function StarRating({ note }) {
  const n = parseFloat(note) || 0;
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`star ${s <= Math.round(n) ? 'filled' : ''}`}>★</span>
      ))}
      <span className="star-rating-value">
        {n > 0 ? `${n.toFixed(1)} / 5` : 'Aucune note'}
      </span>
    </div>
  );
}

function EventCard({ ev, onInscription, onAnnulation, onEvaluate, isUserRegistered, actionLoading }) {
  const participants = clampParticipants(ev.nb_participants);
  const capacity = parseInt(ev.capacite_max, 10) || 0;
  const pct = capacity > 0 ? Math.min(100, Math.round((participants / capacity) * 100)) : 0;
  const isFull = ev.etat === 'complet';
  const isOpen = ev.etat === 'ouvert';
  const canRegister = isOpen && !isFull && !isUserRegistered;
  const busy = actionLoading === ev.id;

  const formatDate = (d) =>
    new Date(d).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <article className="event-card">
      <header className="event-card-header">
        <h3 className="event-card-title">{ev.titre}</h3>
        <span className={`badge badge-${ev.etat}`}>{ev.etat}</span>
      </header>

      <p className="event-card-desc">{ev.description || 'Aucune description.'}</p>

      <div className="event-card-meta">
        <div className="event-meta-item">
          <span className="event-meta-icon">📅</span>
          <span>{formatDate(ev.date_evenement)}</span>
        </div>
        <div className="event-meta-item">
          <span className="event-meta-icon">📍</span>
          <span>{ev.lieu}</span>
        </div>
        <div className="event-meta-item">
          <span className="event-meta-icon">👥</span>
          <span>
            <strong>{participants}</strong> / {capacity} participants
          </span>
        </div>
      </div>

      <div className="event-progress">
        <div className="progress-info">
          <span>Remplissage</span>
          <span className={pct >= 90 ? 'text-danger' : ''}>{pct} %</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${pct}%`,
              background: pct >= 90
                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                : undefined,
            }}
          />
        </div>
      </div>

      <StarRating note={ev.note_moyenne} />

      <div className="event-card-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onInscription(ev.id)}
          disabled={!canRegister || busy}
        >
          {!isOpen ? ev.etat : isFull ? 'Complet' : isUserRegistered ? 'Inscrit ✓' : busy ? '...' : "S'inscrire"}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onAnnulation(ev.id)}
          disabled={!isUserRegistered || busy}
        >
          Annuler
        </button>
        {isUserRegistered && isOpen && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onEvaluate(ev)}
            disabled={busy}
          >
            Noter
          </button>
        )}
      </div>
    </article>
  );
}

export default function Evenements({ notify }) {
  const { user } = useAuth();
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participationsLoading, setParticipationsLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const [userParticipations, setUserParticipations] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [evalModal, setEvalModal] = useState(null);
  const [evalNote, setEvalNote] = useState(5);
  const [evalComment, setEvalComment] = useState('');

  const fetchEvenements = useCallback(async () => {
    try {
      const res = await api.get('/evenements');
      setEvenements(res.data);
    } catch {
      notify('Erreur de connexion à l\'API. Le serveur Laravel est-il démarré ?', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const fetchUserParticipations = useCallback(async () => {
    setParticipationsLoading(true);
    try {
      const res = await api.get('/me/participations');
      setUserParticipations(res.data.map((p) => p.id_evenement));
    } catch {
      notify('Impossible de charger vos inscriptions.', 'error');
      setUserParticipations([]);
    } finally {
      setParticipationsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchEvenements();
    fetchUserParticipations();
  }, [fetchEvenements, fetchUserParticipations]);

  const withAction = async (eventId, fn) => {
    if (participationsLoading) {
      notify('Chargement de vos inscriptions en cours...', 'error');
      return;
    }
    setActionLoading(eventId);
    try {
      await fn();
    } finally {
      setActionLoading(null);
    }
  };

  const handleInscription = (id_evenement) =>
    withAction(id_evenement, async () => {
      try {
        await api.post('/participations/inscrire', { id_evenement });
        notify('Inscription réussie !');
        await fetchEvenements();
        await fetchUserParticipations();
      } catch (err) {
        notify(formatApiError(err, 'Erreur lors de l\'inscription.'), 'error');
      }
    });

  const handleAnnulation = (id_evenement) =>
    withAction(id_evenement, async () => {
      try {
        await api.post('/participations/annuler', { id_evenement });
        notify('Inscription annulée avec succès.');
        await fetchEvenements();
        await fetchUserParticipations();
      } catch (err) {
        notify(formatApiError(err, 'Erreur lors de l\'annulation.'), 'error');
      }
    });

  const submitEvaluation = async () => {
    if (!evalModal) return;
    setActionLoading(evalModal.id);
    try {
      await api.post('/evaluations', {
        id_evenement: evalModal.id,
        note: evalNote,
        commentaire: evalComment || null,
      });
      notify('Évaluation enregistrée !');
      setEvalModal(null);
      setEvalComment('');
      await fetchEvenements();
    } catch (err) {
      notify(formatApiError(err, 'Erreur lors de l\'évaluation.'), 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered =
    filter === 'tous' ? evenements : evenements.filter((e) => e.etat === filter);

  const total = evenements.length;
  const ouverts = evenements.filter((e) => e.etat === 'ouvert').length;
  const myRegistrations = userParticipations.length;

  return (
    <div className="events-page">
      <section className="hero-section">
        <h1 className="hero-title">Découvrez nos Événements</h1>
        <p className="hero-subtitle">
          Bonjour <strong>{user?.prenom} {user?.nom}</strong> — parcourez les événements ouverts et inscrivez-vous en un clic.
        </p>
      </section>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Événements</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{ouverts}</div>
          <div className="stat-label">Ouverts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{myRegistrations}</div>
          <div className="stat-label">Mes inscriptions</div>
        </div>
      </section>

      <nav className="filter-bar" aria-label="Filtrer les événements">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {loading || participationsLoading ? (
        <div className="spinner-container">
          <div className="spinner" />
          <span className="spinner-text">Chargement des événements...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">Aucun événement trouvé</p>
          <p className="empty-state-desc">Essayez un autre filtre ou revenez plus tard.</p>
        </div>
      ) : (
        <section className="events-grid">
          {filtered.map((ev) => (
            <EventCard
              key={ev.id}
              ev={ev}
              onInscription={handleInscription}
              onAnnulation={handleAnnulation}
              onEvaluate={(event) => {
                setEvalModal(event);
                setEvalNote(5);
              }}
              isUserRegistered={userParticipations.includes(ev.id)}
              actionLoading={actionLoading}
            />
          ))}
        </section>
      )}

      {evalModal && (
        <div className="modal-overlay" onClick={() => setEvalModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Évaluer : {evalModal.titre}</h3>
            <div className="form-group">
              <label className="form-label">Note (1 à 5)</label>
              <input
                type="number"
                min={1}
                max={5}
                className="form-input"
                value={evalNote}
                onChange={(e) => setEvalNote(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Commentaire (optionnel)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={evalComment}
                onChange={(e) => setEvalComment(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEvalModal(null)}>
                Fermer
              </button>
              <button type="button" className="btn btn-primary" onClick={submitEvaluation}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
