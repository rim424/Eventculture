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
                <div className="spinner-border text-primary" role="status"></div>
                <p>{t('chargement_attente')}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">{t('evenements_attente')}</h1>
            
            {message && (
                <div className="alert alert-success text-center">{message}</div>
            )}

            {evenements.length === 0 ? (
                <div className="alert alert-info text-center">
                    {t('aucun_evenement_attente')}
                </div>
            ) : (
                <div className="row">
                    {evenements.map((event) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={event.id_evenement}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{event.titre}</h5>
                                    <p className="card-text text-muted">
                                        <strong>{t('organisateur')} :</strong> {event.organisateur?.prenom} {event.organisateur?.nom}<br />
                                        <strong>{t('lieu')} :</strong> {event.lieu}<br />
                                        <strong>{t('date')} :</strong> {new Date(event.date_debut).toLocaleDateString()}<br />
                                        <strong>{t('prix')} :</strong> {event.prix} DH<br />
                                        <strong>{t('places')} :</strong> {event.capacite}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-success flex-grow-1"
                                            onClick={() => validerEvenement(event.id_evenement)}
                                        >
                                            {t('valider')}
                                        </button>
                                        <button 
                                            className="btn btn-danger flex-grow-1"
                                            onClick={() => refuserEvenement(event.id_evenement)}
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