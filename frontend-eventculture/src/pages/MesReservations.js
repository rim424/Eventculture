import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMesReservations, annulerReservation } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const MesReservations = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { t } = useLang();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await getMesReservations();
            const reservationsActives = response.data.filter(res => res.statut === 'confirme');
            setReservations(reservationsActives);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnnuler = async (id) => {
        if (window.confirm(t('confirmer_annulation'))) {
            try {
                await annulerReservation(id);
                fetchReservations();
            } catch (error) {
                alert(t('erreur_annulation'));
            }
        }
    };

    // Fonction corrigée pour télécharger le ticket PDF avec token
    const handleTelechargerTicket = async (id) => {
        try {
            const response = await api.get(`/ticket/${id}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du téléchargement du ticket');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{ color: '#C4552A' }} role="status">
                    <span className="visually-hidden">{t('chargement')}</span>
                </div>
                <p>{t('chargement_reservations')}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4" style={{ color: '#C4552A' }}>{t('mes_reservations')}</h1>
            
            {reservations.length === 0 ? (
                <div className="text-center py-5">
                    <div className="display-1 mb-3"></div>
                    <h3 style={{ color: '#6B3D2E' }}>{t('aucune_reservation')}</h3>
                    <p className="text-muted" style={{ color: '#6B3D2E' }}>{t('decouvrir_evenements')}</p>
                    <button className="btn mt-3" onClick={() => navigate('/')} style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                        {t('voir_evenements')}
                    </button>
                </div>
            ) : (
                <div className="row">
                    {reservations.map((res) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={res.id_reservation}>
                            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="card-header" style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none' }}>
                                    <strong>{t('reservation')} #{res.id_reservation}</strong>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title" style={{ color: '#C4552A' }}>{res.evenement?.titre}</h5>
                                    <p className="card-text text-muted small">
                                        {res.evenement?.categorie?.nom && (
                                            <span className="badge me-2" style={{ backgroundColor: '#E8C99A', color: '#6B3D2E' }}>{res.evenement.categorie.nom}</span>
                                        )}
                                    </p>
                                    <hr style={{ borderColor: '#E8C99A' }} />
                                    <p className="mb-1" style={{ color: '#6B3D2E' }}>
                                        <strong>{t('lieu')} :</strong> {res.evenement?.lieu}
                                    </p>
                                    <p className="mb-1" style={{ color: '#6B3D2E' }}>
                                        <strong>{t('date')} :</strong> {new Date(res.evenement?.date_debut).toLocaleDateString('fr-FR')}
                                    </p>
                                    <p className="mb-1" style={{ color: '#6B3D2E' }}>
                                        <strong>{t('places')} :</strong> {res.nombre_places}
                                    </p>
                                    <p className="mb-1" style={{ color: '#6B3D2E' }}>
                                        <strong>{t('total')} :</strong> {(res.evenement?.prix * res.nombre_places)} DH
                                    </p>
                                    <p className="mb-0" style={{ color: '#6B3D2E' }}>
                                        <strong>{t('reserve_le')} :</strong> {new Date(res.date_reservation).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="card-footer bg-white border-0 pb-3">
                                    <button 
                                        className="btn w-100" 
                                        onClick={() => handleAnnuler(res.id_reservation)}
                                        style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}
                                    >
                                        {t('annuler_reservation')}
                                    </button>
                                    <button 
                                        className="btn w-100 mt-2"
                                        onClick={() => handleTelechargerTicket(res.id_reservation)}
                                        style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}
                                    >
                                        Télécharger ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MesReservations;