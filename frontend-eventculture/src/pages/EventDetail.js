import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvenement, reserver } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige l'affichage par défaut des marqueurs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
    
    // États pour les commentaires
    const [commentaires, setCommentaires] = useState([]);
    const [nouveauCommentaire, setNouveauCommentaire] = useState('');
    const [note, setNote] = useState(5);
    const [commentaireLoading, setCommentaireLoading] = useState(false);

    useEffect(() => {
        fetchEvent();
        fetchCommentaires();
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

    // Charger les commentaires
    const fetchCommentaires = async () => {
        try {
            const response = await api.get(`/commentaires/${id}`);
            setCommentaires(response.data);
        } catch (error) {
            console.error('Erreur chargement commentaires:', error);
        }
    };

    // Ajouter un commentaire
    const handleAjouterCommentaire = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setCommentaireLoading(true);
        try {
            await api.post(`/commentaires/${id}`, {
                commentaire: nouveauCommentaire,
                note: note
            });
            setNouveauCommentaire('');
            setNote(5);
            fetchCommentaires();
        } catch (error) {
            console.error('Erreur ajout commentaire:', error);
        } finally {
            setCommentaireLoading(false);
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

                    {/* Carte Leaflet */}
                    {event.latitude && event.longitude && (
                        <div className="mt-4">
                            <h5 style={{ color: '#6B3D2E', fontFamily: "'Poppins', sans-serif" }}>
                                📍 Localisation de l'événement
                            </h5>
                            <MapContainer
                                center={[parseFloat(event.latitude), parseFloat(event.longitude)]}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ height: '300px', width: '100%', borderRadius: '12px', zIndex: 0 }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[parseFloat(event.latitude), parseFloat(event.longitude)]}>
                                    <Popup>
                                        {event.titre}<br />{event.lieu}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    )}

                    {/* Section Commentaires */}
                    <div className="mt-5">
                        <h4 style={{ color: '#C4552A' }}>Avis et commentaires</h4>
                        
                        {/* Formulaire d'ajout (si connecté) */}
                        {isAuthenticated && (
                            <form onSubmit={handleAjouterCommentaire} className="mb-4 p-3 rounded" style={{ backgroundColor: '#E8C99A' }}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>Note</label>
                                    <select className="form-select" value={note} onChange={(e) => setNote(e.target.value)} style={{ borderColor: '#C4552A' }}>
                                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                        <option value="4">⭐⭐⭐⭐ Très bien</option>
                                        <option value="3">⭐⭐⭐ Bien</option>
                                        <option value="2">⭐⭐ Moyen</option>
                                        <option value="1">⭐ Décevant</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>Votre commentaire</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="3" 
                                        value={nouveauCommentaire} 
                                        onChange={(e) => setNouveauCommentaire(e.target.value)}
                                        placeholder="Partagez votre expérience..."
                                        required
                                        style={{ borderColor: '#C4552A' }}
                                    />
                                </div>
                                <button type="submit" className="btn" disabled={commentaireLoading} style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                                    {commentaireLoading ? 'Envoi...' : 'Publier mon avis'}
                                </button>
                            </form>
                        )}
                        
                        {/* Liste des commentaires */}
                        {commentaires.length === 0 ? (
                            <p className="text-muted">Soyez le premier à donner votre avis !</p>
                        ) : (
                            commentaires.map((com) => (
                                <div key={com.id_commentaire} className="mb-3 p-3 rounded" style={{ backgroundColor: '#FDF6EE', border: '1px solid #E8C99A' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong style={{ color: '#6B3D2E' }}>{com.utilisateur?.prenom} {com.utilisateur?.nom}</strong>
                                            <span className="ms-2">
                                                {'⭐'.repeat(com.note)}{'☆'.repeat(5 - com.note)}
                                            </span>
                                        </div>
                                        <small className="text-muted">{new Date(com.date_commentaire).toLocaleDateString()}</small>
                                    </div>
                                    <p className="mt-2 mb-0" style={{ color: '#6B3D2E' }}>{com.commentaire}</p>
                                </div>
                            ))
                        )}
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