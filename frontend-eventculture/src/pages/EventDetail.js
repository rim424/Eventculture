import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvenement, reserver } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, hasRole, user } = useAuth();
    const { t } = useLang();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nbPlaces, setNbPlaces] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await getEvenement(id);
            setEvent(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReservation = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await reserver({
                id_evenement: id,
                nombre_places: parseInt(nbPlaces)
            });
            setSuccess(t('reservation_effectuee'));
            setError('');
            fetchEvent();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || t('erreur_reservation'));
            setSuccess('');
        }
    };

    // Fonction de suppression (admin ou organisateur propriétaire)
    const handleDelete = async () => {
        if (window.confirm(t('confirmer_suppression'))) {
            try {
                await api.delete(`/evenements/${event.id_evenement}`);
                navigate('/');
            } catch (error) {
                setError(t('erreur_suppression'));
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p>{t('chargement_evenement')}</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center mt-5">
                <h2>{t('evenement_non_trouve')}</h2>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>{t('retour_accueil')}</button>
            </div>
        );
    }

    // Vérifier si l'utilisateur peut modifier/supprimer (admin ou organisateur propriétaire)
    const canModify = hasRole('admin') || (hasRole('organisateur') && event.id_organisateur === user?.id_utilisateur);

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← {t('retour')}</button>

            <div className="row">
                <div className="col-md-12">
                    <h1 className="mb-3">{event.titre}</h1>

                    {event.categorie && (
                        <span className="badge bg-info mb-3 d-inline-block">{event.categorie.nom}</span>
                    )}

                    <div className="card bg-light p-3 mb-4">
                        <p className="mb-0">{event.description}</p>
                    </div>

                    <hr />

                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>{t('lieu')} :</strong> {event.lieu}</p>
                            <p><strong>{t('date')} :</strong> {new Date(event.date_debut).toLocaleDateString()} à {new Date(event.date_debut).toLocaleTimeString()}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>{t('prix')} :</strong> {event.prix} DH</p>
                            <p><strong>{t('places_restantes')} :</strong> {event.places_restantes} / {event.capacite}</p>
                        </div>
                    </div>

                    {/* Boutons Modifier et Supprimer pour admin ou organisateur propriétaire */}
                    {canModify && (
                        <div className="mt-2">
                            <Link to={`/events/edit/${event.id_evenement}`} className="btn btn-warning me-2">
                                 {t('modifier')}
                            </Link>
                            <button onClick={handleDelete} className="btn btn-danger">
                                 {t('supprimer')}
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mt-3">{success}</div>
                    )}
                    {error && (
                        <div className="alert alert-danger mt-3">{error}</div>
                    )}

                    {event.places_restantes > 0 ? (
                        <form onSubmit={handleReservation} className="mt-4 p-3 bg-light rounded">
                            <div className="row g-3 align-items-end">
                                <div className="col-6">
                                    <label className="form-label fw-bold">{t('nombre_places')}</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={nbPlaces} 
                                        onChange={(e) => setNbPlaces(e.target.value)} 
                                        min="1" 
                                        max={event.places_restantes} 
                                        required 
                                    />
                                </div>
                                <div className="col-6">
                                    <button type="submit" className="btn btn-success w-100">
                                        {t('reserver')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <button className="btn btn-secondary w-100 mt-3" disabled>
                            {t('complet')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetail;