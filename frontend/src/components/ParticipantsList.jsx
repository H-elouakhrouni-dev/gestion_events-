import { useState, useEffect } from 'react';
import api, { formatApiError } from '../api';

export default function ParticipantsList({ notify }) {
  const [evenements, setEvenements] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    api
      .get('/evenements')
      .then((res) => {
        setEvenements(res.data);
        if (res.data.length > 0) {
          setSelectedId(String(res.data[0].id));
        }
      })
      .catch(() => notify('Impossible de charger les événements.', 'error'))
      .finally(() => setLoadingList(false));
  }, [notify]);

  useEffect(() => {
    if (!selectedId) return;

    setLoadingParticipants(true);
    api
      .get(`/evenements/${selectedId}/participants`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setData(null);
        notify(formatApiError(err, 'Erreur lors du chargement des participants.'), 'error');
      })
      .finally(() => setLoadingParticipants(false));
  }, [selectedId, notify]);

  const formatDate = (d) =>
    new Date(d).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loadingList) {
    return (
      <section className="glass-card-static participants-panel">
        <p className="spinner-text">Chargement...</p>
      </section>
    );
  }

  return (
    <section className="glass-card-static participants-panel">
      <h2 className="dashboard-section-title">👥 Liste des participants</h2>
      <p className="dashboard-section-desc">
        Consultez les inscrits actifs pour chaque événement (cahier des charges).
      </p>

      {evenements.length === 0 ? (
        <p className="empty-state-desc">Aucun événement disponible.</p>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Événement</label>
            <select
              className="form-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {evenements.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  #{ev.id} — {ev.titre} ({ev.nb_participants}/{ev.capacite_max})
                </option>
              ))}
            </select>
          </div>

          {loadingParticipants ? (
            <div className="spinner-container" style={{ padding: '2rem 0' }}>
              <div className="spinner" />
            </div>
          ) : data ? (
            <>
              <p className="participants-summary">
                <strong>{data.total}</strong> participant(s) inscrit(s) sur{' '}
                <strong>{data.evenement.capacite_max}</strong> places —{' '}
                <span className={`badge badge-${data.evenement.nb_participants >= data.evenement.capacite_max ? 'complet' : 'ouvert'}`}>
                  {data.evenement.titre}
                </span>
              </p>

              {data.participants.length === 0 ? (
                <p className="empty-state-desc">Aucun participant inscrit pour cet événement.</p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Date d&apos;inscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.participants.map((p, index) => (
                        <tr key={p.id}>
                          <td>{index + 1}</td>
                          <td>{p.nom}</td>
                          <td>{p.prenom}</td>
                          <td>{p.email}</td>
                          <td>{formatDate(p.date_inscription)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
