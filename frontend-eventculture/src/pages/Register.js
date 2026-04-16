import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

const Register = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useLang();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('mots_de_passe_non_correspondent'));
            return;
        }
        const result = await register({ nom, prenom, email, mot_de_passe: password, role });
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || t('erreur_inscription'));
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">{t('inscription')}</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">{t('nom')}</label>
                                <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">{t('prenom')}</label>
                                <input type="text" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t('email')}</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t('mot_de_passe')}</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t('confirmer_mot_de_passe')}</label>
                            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">{t('je_suis')}</label>
                            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">{t('spectateur')}</option>
                                <option value="organisateur">{t('organisateur_role')}</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">{t('s_inscrire')}</button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/login">{t('deja_compte')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;