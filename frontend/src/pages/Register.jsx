import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../api';

export default function Register({ notify }) {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await register(form);
      notify(`Compte créé. Bienvenue, ${user.prenom} !`);
      navigate('/');
    } catch (err) {
      notify(formatApiError(err, 'Erreur lors de l\'inscription.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Inscription</h1>
        <p className="auth-subtitle">Créez votre compte utilisateur EventMaster</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="nom"
                className="form-input"
                value={form.nom}
                onChange={handleChange}
                required
                placeholder="Ex: Dupont"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                name="prenom"
                className="form-input"
                value={form.prenom}
                onChange={handleChange}
                required
                placeholder="Ex: Jean"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe (min. 6 caractères)</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              name="password_confirmation"
              className="form-input"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
