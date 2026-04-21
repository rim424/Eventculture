import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useLang();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || t('erreur_connexion'));
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow" style={{ borderRadius: '12px', border: 'none' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4" style={{ color: '#C4552A' }}>{t('connexion')}</h2>
                    {error && <div className="alert" style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: '#6B3D2E' }}>{t('email')}</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderColor: '#E8C99A' }} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: '#6B3D2E' }}>{t('mot_de_passe')}</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderColor: '#E8C99A' }} />
                        </div>
                        <button type="submit" className="btn w-100" style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                            {t('se_connecter')}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/register" style={{ color: '#C4552A' }}>{t('pas_de_compte')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;