import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const DashboardOrganisateur = () => {
    const navigate = useNavigate();
    const { isAuthenticated, hasRole } = useAuth();
    const { t } = useLang();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!hasRole('organisateur') && !hasRole('admin')) {
            navigate('/');
            return;
        }
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/organisateur');
            setStats(response.data);
        } catch (error) {
            console.error('Erreur:', error);
            setError('Impossible de charger les statistiques');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{ color: '#C4552A' }} role="status"></div>
                <p className="mt-2">{t('chargement')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <div className="alert" style={{ backgroundColor: '#A84420', color: '#FDF6EE', borderRadius: '8px' }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4" style={{ color: '#C4552A' }}>Dashboard Organisateur</h1>

            {/* Cartes de statistiques */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '2rem' }}>{stats?.mes_evenements || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Mes événements</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '2rem' }}>{stats?.evenements_valides || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Événements validés</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '2rem' }}>{stats?.evenements_attente || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>En attente</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '2rem' }}>{stats?.total_reservations || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Réservations</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '2rem' }}>{stats?.chiffre_affaires || 0} DH</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Chiffre d'affaires</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '2rem' }}>{stats?.taux_remplissage || 0}%</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Taux de remplissage</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphique des réservations par mois */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <h5 className="mb-3" style={{ color: '#C4552A' }}>Réservations par mois</h5>
                        {stats?.reservations_par_mois?.length === 0 ? (
                            <p className="text-muted">Aucune donnée</p>
                        ) : (
                            stats?.reservations_par_mois?.map((item, index) => (
                                <div key={index} className="mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span style={{ color: '#6B3D2E' }}>Mois {item.mois}</span>
                                        <span style={{ color: '#C4552A' }}>{item.total}</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar" style={{ width: `${(item.total / Math.max(...stats.reservations_par_mois.map(i => i.total), 1)) * 100}%`, backgroundColor: '#C4552A' }}></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Liste des événements */}
            <h3 className="mb-3" style={{ color: '#6B3D2E' }}>Mes événements</h3>
            <div className="row">
                {stats?.evenements?.length === 0 ? (
                    <div className="col-12">
                        <div className="alert text-center" style={{ backgroundColor: '#E8C99A', color: '#6B3D2E', borderRadius: '8px' }}>
                            Aucun événement créé
                        </div>
                    </div>
                ) : (
                    stats?.evenements?.map((event) => (
                        <div className="col-md-6 mb-3" key={event.id_evenement}>
                            <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 style={{ color: '#C4552A' }}>{event.titre}</h5>
                                            <p className="mb-1" style={{ color: '#6B3D2E' }}>
                                                <strong>{t('date')} :</strong> {new Date(event.date_debut).toLocaleDateString()}
                                            </p>
                                            <p className="mb-0" style={{ color: '#6B3D2E' }}>
                                                <strong>Réservations :</strong> {event.reservations_count || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="badge" style={{ backgroundColor: event.statut === 'valide' ? '#5A8A3A' : '#E8C99A', color: event.statut === 'valide' ? '#FDF6EE' : '#6B3D2E' }}>
                                                {event.statut === 'valide' ? 'Validé' : 'En attente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardOrganisateur;