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
                <div className="spinner-border" style={{ color: '#C4552A' }} role="status"></div>
                <p>{t('chargement_evenement')}</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center mt-5">
                <h2 style={{ color: '#C4552A' }}>{t('evenement_non_trouve')}</h2>
                <button className="btn mt-3" onClick={() => navigate('/')} style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                    {t('retour_accueil')}
                </button>
            </div>
        );
    }

    // Vérifier si l'utilisateur peut modifier/supprimer (admin ou organisateur propriétaire)
    const canModify = hasRole('admin') || (hasRole('organisateur') && event.id_organisateur === user?.id_utilisateur);

    return (
        <div className="container mt-4">
            <button className="btn mb-3" onClick={() => navigate(-1)} style={{ backgroundColor: '#E8C99A', color: '#6B3D2E', border: 'none', borderRadius: '8px' }}>
                ← {t('retour')}
            </button>

            <div className="row">
                <div className="col-md-12">
                    <h1 className="mb-3" style={{ color: '#C4552A' }}>{event.titre}</h1>

                    {event.categorie && (
                        <span className="badge mb-3 d-inline-block" style={{ backgroundColor: '#E8C99A', color: '#6B3D2E' }}>{event.categorie.nom}</span>
                    )}

                    <div className="card p-3 mb-4" style={{ backgroundColor: '#E8C99A', border: 'none', borderRadius: '12px' }}>
                        <p className="mb-0" style={{ color: '#6B3D2E' }}>{event.description}</p>
                    </div>

                    <hr style={{ borderColor: '#E8C99A' }} />

                    <div className="row">
                        <div className="col-md-6">
                            <p style={{ color: '#6B3D2E' }}><strong>{t('lieu')} :</strong> {event.lieu}</p>
                            <p style={{ color: '#6B3D2E' }}><strong>{t('date')} :</strong> {new Date(event.date_debut).toLocaleDateString()} à {new Date(event.date_debut).toLocaleTimeString()}</p>
                        </div>
                        <div className="col-md-6">
                            <p style={{ color: '#6B3D2E' }}><strong>{t('prix')} :</strong> {event.prix} DH</p>
                            <p style={{ color: '#6B3D2E' }}><strong>{t('places_restantes')} :</strong> {event.places_restantes} / {event.capacite}</p>
                        </div>
                    </div>

                    {/* Boutons Modifier et Supprimer pour admin ou organisateur propriétaire */}
                    {canModify && (
                        <div className="mt-2">
                            <Link to={`/events/edit/${event.id_evenement}`} className="btn me-2" style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                                {t('modifier')}
                            </Link>
                            <button onClick={handleDelete} className="btn" style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                                {t('supprimer')}
                            </button>
                        </div>
                    )}

                    {success && (
                        <div className="alert mt-3" style={{ backgroundColor: '#5A8A3A', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>{success}</div>
                    )}
                    {error && (
                        <div className="alert mt-3" style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>{error}</div>
                    )}

                    {event.places_restantes > 0 ? (
                        <form onSubmit={handleReservation} className="mt-4 p-3 rounded" style={{ backgroundColor: '#E8C99A' }}>
                            <div className="row g-3 align-items-end">
                                <div className="col-6">
                                    <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('nombre_places')}</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={nbPlaces} 
                                        onChange={(e) => setNbPlaces(e.target.value)} 
                                        min="1" 
                                        max={event.places_restantes} 
                                        required 
                                        style={{ borderColor: '#C4552A' }}
                                    />
                                </div>
                                <div className="col-6">
                                    <button type="submit" className="btn w-100" style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                                        {t('reserver')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <button className="btn w-100 mt-3" disabled style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                            {t('complet')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetail;