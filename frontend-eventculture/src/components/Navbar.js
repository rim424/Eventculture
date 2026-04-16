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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">EventCulture</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">{t('accueil')}</Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/mes-reservations">{t('mes_reservations')}</Link>
                            </li>
                        )}
                        {(hasRole('organisateur') || hasRole('admin')) && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/events/create">{t('creer_evenement')}</Link>
                            </li>
                        )}
                        {hasRole('admin') && (
                             <li className="nav-item">
                                <Link className="nav-link" to="/admin/evenements/attente">{t('a_valider')}</Link>
                             </li>
                        )}
                    </ul>
                    
                    <ul className="navbar-nav ms-auto">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">{user?.prenom} {user?.nom}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>{t('deconnexion')}</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">{t('connexion')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">{t('inscription')}</Link>
                                </li>
                            </>
                        )}
                        {/* Bouton de changement de langue */}
                        <li className="nav-item ms-2">
                            <button className="btn btn-outline-light btn-sm" onClick={toggleLangue}>
                                {langue === 'fr' ? 'English' : 'Français'}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;