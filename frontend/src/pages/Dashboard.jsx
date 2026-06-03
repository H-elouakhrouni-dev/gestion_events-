import { useState } from 'react';
import api, { formatApiError } from '../api';
import ParticipantsList from '../components/ParticipantsList';

const INIT_FORM = {
  titre: '',
  description: '',
  date_evenement: '',
  lieu: '',
  capacite_max: '',
};

export default function Dashboard({ notify }) {
  const [form, setForm] = useState(INIT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [archiverLoading, setArchiverLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/evenements', form);
      notify('Événement créé avec succès !');
      setForm(INIT_FORM);
    } catch (err) {
      notify(formatApiError(err, 'Erreur lors de la création.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const runArchiver = async () => {
    setArchiverLoading(true);
    try {
      const res = await api.post('/evenements/archiver');
      notify(res.data.message);
    } catch {
      notify('Erreur lors de l\'archivage.', 'error');
    } finally {
      setArchiverLoading(false);
    }
  };

  const runStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.post('/statistiques');
      notify(res.data.message || 'Statistiques générées !');
      setLogs(res.data.logs || []);
    } catch {
      notify('Erreur lors de la génération des statistiques.', 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Admin</h1>
        <p className="dashboard-subtitle">
          Créez des événements et exécutez les procédures stockées MySQL.
        </p>
      </header>

      <div className="dashboard-layout">
        <section className="glass-card-static dashboard-form-panel">
          <h2 className="dashboard-section-title">✦ Créer un événement</h2>
          <p className="dashboard-section-desc">
            Le trigger <code>trg_after_insert_evenement</code> historise chaque création.
          </p>

          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  name="titre"
                  className="form-input"
                  placeholder="Ex: Conférence IA & Machine Learning"
                  value={form.titre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  rows={3}
                  placeholder="Décrivez l'événement..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date & heure</label>
                <input
                  type="datetime-local"
                  name="date_evenement"
                  className="form-input"
                  value={form.date_evenement}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lieu</label>
                <input
                  type="text"
                  name="lieu"
                  className="form-input"
                  placeholder="Ex: Casablanca"
                  value={form.lieu}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Capacité maximum</label>
                <input
                  type="number"
                  name="capacite_max"
                  className="form-input"
                  placeholder="Ex: 150"
                  min="1"
                  value={form.capacite_max}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ marginTop: '1.25rem' }}>
              {submitting ? 'Enregistrement...' : 'Créer l\'événement'}
            </button>
          </form>
        </section>

        <div className="dashboard-procedures">
          <ProcedureCard
            icon="🗂️"
            iconClass="purple"
            title="Archivage automatique"
            tag="proc_archiver + Curseur C1"
            desc="Archive tous les événements passés via un curseur MySQL."
            buttonLabel={archiverLoading ? 'En cours...' : "Lancer l'archivage"}
            onClick={runArchiver}
            loading={archiverLoading}
            btnClass="btn-primary"
          />

          <ProcedureCard
            icon="📊"
            iconClass="cyan"
            title="Statistiques globales"
            tag="proc_generer_stats + Curseur C2"
            desc="Calcule le taux de remplissage et enregistre les logs."
            buttonLabel={statsLoading ? 'Calcul...' : 'Générer statistiques'}
            onClick={runStats}
            loading={statsLoading}
            btnClass="btn-secondary"
          />

          {logs.length > 0 && (
            <div className="procedure-card logs-panel">
              <h3 className="procedure-card-title">Logs générés ({logs.length})</h3>
              <ul className="logs-list">
                {logs.map((l) => (
                  <li key={l.id} className="log-item">{l.description}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="procedure-card">
            <h3 className="procedure-card-title">🔔 Annuler un événement</h3>
            <p className="procedure-card-desc">proc_notifier_annulation + Curseur C3</p>
            <CancelEventForm notify={notify} />
          </div>
        </div>
      </div>

      <ParticipantsList notify={notify} />
    </div>
  );
}

function ProcedureCard({ icon, iconClass, title, tag, desc, buttonLabel, onClick, loading, btnClass }) {
  return (
    <div className="procedure-card">
      <div className="procedure-card-head">
        <span className={`procedure-icon ${iconClass}`}>{icon}</span>
        <div>
          <h3 className="procedure-card-title">{title}</h3>
          <span className="procedure-tag">{tag}</span>
        </div>
      </div>
      <p className="procedure-card-desc">{desc}</p>
      <button type="button" className={`btn ${btnClass}`} onClick={onClick} disabled={loading}>
        {buttonLabel}
      </button>
    </div>
  );
}

function CancelEventForm({ notify }) {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!id) return notify('Veuillez entrer un ID valide.', 'error');
    setLoading(true);
    try {
      const res = await api.post(`/evenements/${id}/annuler`);
      notify(res.data.message);
      setId('');
    } catch (err) {
      notify(formatApiError(err, 'Erreur lors de l\'annulation.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-form">
      <input
        type="number"
        className="form-input"
        placeholder="ID événement"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button type="button" className="btn btn-danger" onClick={handleCancel} disabled={loading}>
        {loading ? '...' : 'Annuler'}
      </button>
    </div>
  );
}
