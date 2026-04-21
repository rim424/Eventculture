import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const DashboardAdmin = () => {
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
        if (!hasRole('admin')) {
            navigate('/');
            return;
        }
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/admin');
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
            <h1 className="text-center mb-4" style={{ color: '#C4552A' }}>Dashboard Administrateur</h1>

            {/* Cartes de statistiques */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.total_utilisateurs || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Utilisateurs</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.total_evenements || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Événements</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.total_reservations || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Réservations</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.chiffre_affaires || 0} DH</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Chiffre d'affaires</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.taux_remplissage || 0}%</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Taux de remplissage</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.evenements_attente || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>À valider</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.evenements_supprimes || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Supprimés</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <div className="card-body">
                            <h3 style={{ color: '#C4552A', fontSize: '1.8rem' }}>{stats?.organisateurs_actifs || 0}</h3>
                            <p className="mb-0" style={{ color: '#6B3D2E' }}>Organisateurs actifs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Événements par catégorie */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <h5 className="mb-3" style={{ color: '#C4552A' }}>Événements par catégorie</h5>
                        {stats?.evenements_par_categorie?.length === 0 ? (
                            <p className="text-muted">Aucune donnée</p>
                        ) : (
                            stats?.evenements_par_categorie?.map((cat, index) => (
                                <div key={index} className="mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span style={{ color: '#6B3D2E' }}>{cat.nom}</span>
                                        <span style={{ color: '#C4552A' }}>{cat.evenements_count}</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar" style={{ width: `${(cat.evenements_count / Math.max(...stats.evenements_par_categorie.map(c => c.evenements_count), 1)) * 100}%`, backgroundColor: '#C4552A' }}></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <h5 className="mb-3" style={{ color: '#C4552A' }}>Événements par mois</h5>
                        {stats?.evenements_par_mois?.length === 0 ? (
                            <p className="text-muted">Aucune donnée</p>
                        ) : (
                            stats?.evenements_par_mois?.map((item, index) => (
                                <div key={index} className="mb-2">
                                    <div className="d-flex justify-content-between">
                                        <span style={{ color: '#6B3D2E' }}>Mois {item.mois}</span>
                                        <span style={{ color: '#C4552A' }}>{item.total}</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar" style={{ width: `${(item.total / Math.max(...stats.evenements_par_mois.map(i => i.total), 1)) * 100}%`, backgroundColor: '#C4552A' }}></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Réservations par mois */}
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

            {/* Top 5 événements et Top 5 organisateurs */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <h5 className="mb-3" style={{ color: '#C4552A' }}>Top 5 événements</h5>
                        {stats?.top_evenements?.length === 0 ? (
                            <p className="text-muted">Aucune donnée</p>
                        ) : (
                            stats?.top_evenements?.map((event, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid #E8C99A' }}>
                                    <span style={{ color: '#6B3D2E' }}>{event.titre}</span>
                                    <span className="badge" style={{ backgroundColor: '#C4552A', color: '#FDF6EE' }}>{event.reservations_count} rés.</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                        <h5 className="mb-3" style={{ color: '#C4552A' }}>Top 5 organisateurs</h5>
                        {stats?.top_organisateurs?.length === 0 ? (
                            <p className="text-muted">Aucune donnée</p>
                        ) : (
                            stats?.top_organisateurs?.map((org, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid #E8C99A' }}>
                                    <span style={{ color: '#6B3D2E' }}>{org.prenom} {org.nom}</span>
                                    <span className="badge" style={{ backgroundColor: '#C4552A', color: '#FDF6EE' }}>{org.evenements_count} évts</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;