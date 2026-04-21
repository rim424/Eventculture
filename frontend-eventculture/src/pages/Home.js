import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvenements } from '../services/api';
import { useLang } from '../contexts/LangContext';

// Images spécifiques pour chaque type d'événement (basées sur le titre) - utilisé uniquement si l'événement n'a pas de photo
const getImageForEvent = (titre) => {
    const imageMap = {
        'Concert de Jazz': 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500',
        'Festival des Arts': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500',
        'Exposition de Peinture': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500',
        'Théâtre Classique': 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500',
        'Festival Gnaoua': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500',
        'Conférence sur l\'Art': 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500',
        'Concert de Musique Andalouse': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
        'Cinéma en Plein Air': 'https://images.unsplash.com/photo-1483998429104-a4c3d90f2c4f?w=500',
        'Spectacle de Danse': 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500',
        'Festival du Film': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500',
        'Soirée Poésie': 'https://images.unsplash.com/photo-1459749411177-04bf5292ceea?w=500',
        'Opéra Royal': 'https://images.unsplash.com/photo-1507676184212-d6e6e6c6a5c6?w=500',
        'Exposition de Calligraphie': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500',
        'Concert de Musique Sacrée': 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=500',
        'Festival du Théâtre': 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500',
        'Nuit des Musées': 'https://images.unsplash.com/photo-1534432586043-ead5b99229fb?w=500',
        'Concert de Raï': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
        'Festival des Andalousies': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500',
        'Exposition de Photographie': 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=500',
        'Spectacle de Cirque': 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500',
    };
    return imageMap[titre] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500';
};

const Home = () => {
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLang();

    useEffect(() => {
        fetchEvenements();
    }, []);

    const fetchEvenements = async () => {
        try {
            const response = await getEvenements();
            let data = response.data?.data || response.data;
            if (!Array.isArray(data)) data = [];
            
            const eventsWithData = data.map((event) => ({
                ...event,
                displayImage: event.image || getImageForEvent(event.titre)
            }));
            setEvenements(eventsWithData);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{ color: '#C4552A' }} role="status"></div>
                <p>{t('chargement')}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* ✅ HERO SECTION AJOUTÉE */}
            <div className="hero-section text-center py-5 mb-5" style={{
                background: 'linear-gradient(135deg, #6B3D2E 0%, #C4552A 100%)',
                borderRadius: '0 0 50px 50px',
                color: '#FDF6EE'
            }}>
                <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {t('evenements_culturels')}
                </h1>
                <p className="lead mb-4 px-3">{t('decouvrez_reservez')}</p>
                <button 
                    className="btn btn-light rounded-pill px-4 py-2 fw-semibold"
                    onClick={() => {
                        const eventsSection = document.getElementById('events-section');
                        if (eventsSection) eventsSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ color: '#6B3D2E' }}
                >
                    Explorer les événements
                </button>
            </div>

            {/* Section des événements */}
            <div id="events-section">
                <h1 className="text-center mb-4" style={{ color: '#C4552A' }}>{t('evenements_culturels')}</h1>
                <p className="text-center mb-5" style={{ color: '#6B3D2E' }}>{t('decouvrez_reservez')}</p>

                {evenements.length === 0 ? (
                    <div className="alert text-center" style={{ backgroundColor: '#E8C99A', color: '#6B3D2E', border: 'none' }}>
                        {t('aucun_evenement')}
                    </div>
                ) : (
                    <div className="row">
                        {evenements.map((event) => (
                            <div className="col-md-4 col-lg-3 mb-4" key={event.id_evenement}>
                                <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                    <img 
                                        src={event.image ? `http://localhost:8000${event.image}` : getImageForEvent(event.titre)} 
                                        className="card-img-top" 
                                        alt={event.titre}
                                        style={{ height: '180px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = getImageForEvent(event.titre);
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ color: '#6B3D2E' }}>{event.titre}</h5>
                                        <p className="card-text text-muted small">
                                            {event.categorie?.nom && (
                                                <span className="badge" style={{ backgroundColor: '#E8C99A', color: '#6B3D2E' }}>{event.categorie.nom}</span>
                                            )}
                                        </p>
                                        <p className="card-text" style={{ color: '#6B3D2E' }}>
                                            <strong>{t('lieu')} :</strong> {event.lieu}<br />
                                            <strong>{t('date')} :</strong> {new Date(event.date_debut).toLocaleDateString()}<br />
                                            <strong>{t('prix')} :</strong> {event.prix} DH<br />
                                            <strong>{t('places')} :</strong> {event.places_restantes} / {event.capacite}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-white border-0 pb-3">
                                        <Link to={`/events/${event.id_evenement}`} className="btn w-100" style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                                            {t('voir_details')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;