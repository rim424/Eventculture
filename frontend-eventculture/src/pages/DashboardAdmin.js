import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

// ✅ IMPORT CHART.JS
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

    // ✅ Export XML
    const handleExportXML = async () => {
        try {
            const response = await api.get('/export/xml', { responseType: 'blob' });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'evenements.xml');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Erreur lors de l\'export');
        }
    };

    // ✅ Import XML
    const handleImportXML = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('fichier', file);
        
        try {
            const response = await api.post('/import/xml', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            alert('Erreur lors de l\'import');
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

            {/* ✅ Boutons Import/Export XML */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex gap-3">
                        <button 
                            className="btn"
                            onClick={handleExportXML}
                            style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}
                        >
                            📄 Exporter les événements (XML)
                        </button>
                        <label className="btn" style={{ backgroundColor: '#C4552A', color: '#FDF6EE', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            📂 Importer des événements (XML)
                            <input type="file" accept=".xml" style={{ display: 'none' }} onChange={handleImportXML} />
                        </label>
                    </div>
                </div>
            </div>

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

            {/* ✅ Graphiques : Histogramme (Bar) + Camembert (Pie) */}
            {stats?.evenements_par_categorie && stats.evenements_par_categorie.length > 0 && (
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                            <h5 className="mb-3" style={{ color: '#C4552A' }}>📊 Événements par catégorie </h5>
                            <Bar
                                data={{
                                    labels: stats.evenements_par_categorie.map(c => c.nom),
                                    datasets: [{
                                        label: "Nombre d'événements",
                                        data: stats.evenements_par_categorie.map(c => c.evenements_count),
                                        backgroundColor: '#C4552A',
                                        borderRadius: 8,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: 'top' } }
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                            <h5 className="mb-3" style={{ color: '#C4552A' }}> Répartition par catégorie </h5>
                            <Pie
                                data={{
                                    labels: stats.evenements_par_categorie.map(c => c.nom),
                                    datasets: [{
                                        data: stats.evenements_par_categorie.map(c => c.evenements_count),
                                        backgroundColor: ['#C4552A', '#6B3D2E', '#E8C99A', '#5A8A3A', '#A84420', '#D4A76A'],
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: 'right' } }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Graphique Chart.js – Réservations par mois (courbe) */}
            {stats?.reservations_par_mois && stats.reservations_par_mois.length > 0 && (
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card p-3 shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
                            <h5 className="mb-3" style={{ color: '#C4552A' }}>📈 Réservations par mois </h5>
                            <Line
                                data={{
                                    labels: stats.reservations_par_mois.map(item => `Mois ${item.mois}`),
                                    datasets: [{
                                        label: 'Nombre de réservations',
                                        data: stats.reservations_par_mois.map(item => item.total),
                                        borderColor: '#C4552A',
                                        backgroundColor: 'rgba(196, 85, 42, 0.1)',
                                        tension: 0.3,
                                        fill: true,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: { legend: { position: 'top' } }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Top 5 événements */}
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