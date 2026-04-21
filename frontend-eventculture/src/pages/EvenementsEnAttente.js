import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const EvenementsEnAttente = () => {
    const navigate = useNavigate();
    const { hasRole, isAuthenticated } = useAuth();
    const { t } = useLang();
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!hasRole('admin')) {
            navigate('/');
            return;
        }
        fetchEvenementsEnAttente();
    }, []);

    // Modification ici : utiliser /test-en-attente au lieu de /evenements/en-attente
    const fetchEvenementsEnAttente = async () => {
        try {
            const response = await api.get('/test-en-attente');
            setEvenements(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const validerEvenement = async (id) => {
        try {
            await api.put(`/evenements/${id}/valider`);
            setMessage(t('validation_succes'));
            fetchEvenementsEnAttente();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(t('erreur_validation'));
        }
    };

    const refuserEvenement = async (id) => {
        try {
            await api.delete(`/evenements/${id}`);
            setMessage(t('refus_succes'));
            fetchEvenementsEnAttente();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(t('erreur_refus'));
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{ color: '#C4552A' }} role="status"></div>
                <p>{t('chargement_attente')}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4" style={{ color: '#C4552A' }}>{t('evenements_attente')}</h1>
            
            {message && (
                <div className="alert text-center" style={{ backgroundColor: '#5A8A3A', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                    {message}
                </div>
            )}

            {evenements.length === 0 ? (
                <div className="alert text-center" style={{ backgroundColor: '#E8C99A', color: '#6B3D2E', border: 'none', borderRadius: '8px' }}>
                    {t('aucun_evenement_attente')}
                </div>
            ) : (
                <div className="row">
                    {evenements.map((event) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={event.id_evenement}>
                            <div className="card shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="card-body">
                                    <h5 className="card-title" style={{ color: '#C4552A' }}>{event.titre}</h5>
                                    <p className="card-text" style={{ color: '#6B3D2E' }}>
                                        <strong>{t('organisateur')} :</strong> {event.organisateur?.prenom} {event.organisateur?.nom}<br />
                                        <strong>{t('lieu')} :</strong> {event.lieu}<br />
                                        <strong>{t('date')} :</strong> {new Date(event.date_debut).toLocaleDateString()}<br />
                                        <strong>{t('prix')} :</strong> {event.prix} DH<br />
                                        <strong>{t('places')} :</strong> {event.capacite}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn flex-grow-1"
                                            onClick={() => validerEvenement(event.id_evenement)}
                                            style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}
                                        >
                                            {t('valider')}
                                        </button>
                                        <button 
                                            className="btn flex-grow-1"
                                            onClick={() => refuserEvenement(event.id_evenement)}
                                            style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}
                                        >
                                            {t('refuser')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EvenementsEnAttente;