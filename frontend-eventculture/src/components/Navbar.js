import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';

const Navbar = () => {
    const { user, logout, isAuthenticated, hasRole } = useAuth();
    const { t, langue, toggleLangue } = useLang();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{ 
            backgroundColor: '#FDF6EE',
            boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            fontFamily: "'Poppins', sans-serif"
        }}>
            <div className="container">
                <div className="navbar navbar-expand-lg p-0">
                    <Link className="navbar-brand" to="/" style={{ 
                        color: '#6B3D2E', 
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        fontFamily: "'Playfair Display', serif"
                    }}>
                        EventCulture
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/" style={{ 
                                    color: '#6B3D2E', 
                                    fontWeight: 500,
                                    transition: 'all 0.3s',
                                    margin: '0 5px'
                                }}>{t('accueil')}</Link>
                            </li>
                            {isAuthenticated && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/mes-reservations" style={{ 
                                        color: '#6B3D2E', 
                                        fontWeight: 500,
                                        transition: 'all 0.3s',
                                        margin: '0 5px'
                                    }}>{t('mes_reservations')}</Link>
                                </li>
                            )}
                            {(hasRole('organisateur') || hasRole('admin')) && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/events/create" style={{ 
                                        color: '#6B3D2E', 
                                        fontWeight: 500,
                                        transition: 'all 0.3s',
                                        margin: '0 5px'
                                    }}>{t('creer_evenement')}</Link>
                                </li>
                            )}
                            {/* Lien Dashboard Organisateur */}
                            {hasRole('organisateur') && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard/organisateur" style={{ 
                                        color: '#6B3D2E', 
                                        fontWeight: 500,
                                        transition: 'all 0.3s',
                                        margin: '0 5px'
                                    }}>Dashboard</Link>
                                </li>
                            )}
                            {/* Lien Dashboard Admin */}
                            {hasRole('admin') && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard/admin" style={{ 
                                        color: '#6B3D2E', 
                                        fontWeight: 500,
                                        transition: 'all 0.3s',
                                        margin: '0 5px'
                                    }}>Dashboard Admin</Link>
                                </li>
                            )}
                            {hasRole('admin') && (
                                 <li className="nav-item">
                                    <Link className="nav-link" to="/admin/evenements/attente" style={{ 
                                        color: '#6B3D2E', 
                                        fontWeight: 500,
                                        transition: 'all 0.3s',
                                        margin: '0 5px'
                                    }}>{t('a_valider')}</Link>
                                 </li>
                            )}
                        </ul>
                        
                        <ul className="navbar-nav ms-auto">
                            {isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                        <span className="nav-link" style={{ 
                                            color: '#6B3D2E', 
                                            fontWeight: 500,
                                            background: '#E8C99A',
                                            borderRadius: '20px',
                                            padding: '5px 15px'
                                        }}>{user?.prenom} {user?.nom}</span>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <button className="btn btn-sm" style={{ 
                                            backgroundColor: '#C4552A', 
                                            color: '#FDF6EE', 
                                            border: 'none',
                                            borderRadius: '25px',
                                            padding: '5px 18px',
                                            transition: 'all 0.3s',
                                            fontWeight: 500
                                        }} 
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#A84420'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#C4552A'}
                                        onClick={handleLogout}>
                                            {t('deconnexion')}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login" style={{ 
                                            color: '#6B3D2E', 
                                            fontWeight: 500,
                                            transition: 'all 0.3s'
                                        }}>{t('connexion')}</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register" style={{ 
                                            color: '#6B3D2E', 
                                            fontWeight: 500,
                                            transition: 'all 0.3s'
                                        }}>{t('inscription')}</Link>
                                    </li>
                                </>
                            )}
                            {/* Bouton de changement de langue */}
                            <li className="nav-item ms-2">
                                <button className="btn btn-sm" onClick={toggleLangue} style={{ 
                                    border: '2px solid #C4552A', 
                                    color: '#C4552A',
                                    backgroundColor: 'transparent',
                                    borderRadius: '25px',
                                    padding: '5px 15px',
                                    transition: 'all 0.3s',
                                    fontWeight: 500
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#C4552A';
                                    e.target.style.color = '#FDF6EE';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#C4552A';
                                }}>
                                    {langue === 'fr' ? 'English' : 'Français'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;