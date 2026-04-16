import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvenement, getCategories } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { hasRole, isAuthenticated } = useAuth();
    const { t } = useLang();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        date_debut: '',
        date_fin: '',
        lieu: '',
        prix: 0,
        capacite: 1,
        id_categorie: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!hasRole('organisateur') && !hasRole('admin')) {
            navigate('/');
            return;
        }
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Créer l'événement
            const response = await createEvenement(formData);
            const eventId = response.data.id_evenement;

            // 2. Uploader l'image si elle existe
            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append('image', imageFile);
                await api.post(`/evenements/${eventId}/upload-image`, formDataImage, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || t('erreur_creation'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '700px' }}>
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">{t('creer_evenement')}</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">{t('titre')} *</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="titre" 
                                value={formData.titre} 
                                onChange={handleChange} 
                                placeholder={t('exemple_titre')}
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold">{t('description')}</label>
                            <textarea 
                                className="form-control" 
                                name="description" 
                                rows="4" 
                                value={formData.description} 
                                onChange={handleChange}
                                placeholder={t('exemple_description')}
                            ></textarea>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">{t('date_debut')} *</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control" 
                                    name="date_debut" 
                                    value={formData.date_debut} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">{t('date_fin')}</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control" 
                                    name="date_fin" 
                                    value={formData.date_fin} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold">{t('lieu')} *</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="lieu" 
                                value={formData.lieu} 
                                onChange={handleChange}
                                placeholder={t('exemple_lieu')}
                                required 
                            />
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">{t('prix')} (DH)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="prix" 
                                    value={formData.prix} 
                                    onChange={handleChange} 
                                    min="0" 
                                    step="0.01"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">{t('capacite')} *</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="capacite" 
                                    value={formData.capacite} 
                                    onChange={handleChange} 
                                    min="1" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        {/* Champ pour l'upload de photo */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">{t('photo')}</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt={t('apercu')} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold">{t('categorie')} *</label>
                            <select 
                                className="form-select" 
                                name="id_categorie" 
                                value={formData.id_categorie} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">{t('selectionner_categorie')}</option>
                                {categories.map(cat => (
                                    <option key={cat.id_categorie} value={cat.id_categorie}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                                {loading ? t('creation_en_cours') : t('creer_evenement_btn')}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                                {t('annuler')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;