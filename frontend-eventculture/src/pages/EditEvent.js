import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvenement, updateEvenement, getCategories } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import api from '../services/api';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasRole, isAuthenticated } = useAuth();
    const { t } = useLang();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [currentImage, setCurrentImage] = useState('');
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
        fetchEvent();
        fetchCategories();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await getEvenement(id);
            const event = response.data;
            setFormData({
                titre: event.titre || '',
                description: event.description || '',
                date_debut: event.date_debut ? event.date_debut.slice(0, 16) : '',
                date_fin: event.date_fin ? event.date_fin.slice(0, 16) : '',
                lieu: event.lieu || '',
                prix: event.prix || 0,
                capacite: event.capacite || 1,
                id_categorie: event.id_categorie || ''
            });
            // Stocker l'URL complète de l'image pour l'affichage
            setCurrentImage(event.image ? `http://localhost:8000${event.image}` : '');
        } catch (error) {
            console.error('Erreur:', error);
            setError(t('erreur_chargement'));
        } finally {
            setLoading(false);
        }
    };

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
        setSubmitting(true);
        setError('');

        try {
            // 1. Mettre à jour l'événement
            await updateEvenement(id, formData);

            // 2. Uploader la nouvelle image si elle existe
            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append('image', imageFile);
                await api.post(`/evenements/${id}/upload-image`, formDataImage, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // 3. Rediriger et forcer le rechargement de la page
            navigate(`/events/${id}`);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (err) {
            setError(err.response?.data?.message || t('erreur_modification'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{ color: '#C4552A' }} role="status"></div>
                <p className="mt-2">{t('chargement_evenement')}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '700px' }}>
            <div className="card shadow" style={{ borderRadius: '12px', border: 'none' }}>
                <div className="card-header" style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '12px 12px 0 0' }}>
                    <h3 className="mb-0">{t('modifier_evenement')}</h3>
                </div>
                <div className="card-body">
                    {error && <div className="alert" style={{ backgroundColor: '#A84420', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('titre')} *</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="titre" 
                                value={formData.titre} 
                                onChange={handleChange} 
                                required 
                                style={{ borderColor: '#E8C99A' }}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('description')}</label>
                            <textarea 
                                className="form-control" 
                                name="description" 
                                rows="4" 
                                value={formData.description} 
                                onChange={handleChange}
                                style={{ borderColor: '#E8C99A' }}
                            ></textarea>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('date_debut')} *</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control" 
                                    name="date_debut" 
                                    value={formData.date_debut} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ borderColor: '#E8C99A' }}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('date_fin')}</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-control" 
                                    name="date_fin" 
                                    value={formData.date_fin} 
                                    onChange={handleChange} 
                                    style={{ borderColor: '#E8C99A' }}
                                />
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('lieu')} *</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="lieu" 
                                value={formData.lieu} 
                                onChange={handleChange} 
                                required 
                                style={{ borderColor: '#E8C99A' }}
                            />
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('prix')} (DH)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="prix" 
                                    value={formData.prix} 
                                    onChange={handleChange} 
                                    min="0" 
                                    step="0.01"
                                    style={{ borderColor: '#E8C99A' }}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('capacite')} *</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="capacite" 
                                    value={formData.capacite} 
                                    onChange={handleChange} 
                                    min="1" 
                                    required 
                                    style={{ borderColor: '#E8C99A' }}
                                />
                            </div>
                        </div>
                        
                        {/* Affichage de l'image actuelle */}
                        {currentImage && (
                            <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('image_actuelle')}</label>
                                <div>
                                    <img src={currentImage} alt={t('image_actuelle')} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            </div>
                        )}
                        
                        {/* Champ pour upload nouvelle photo */}
                        <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('nouvelle_photo')}</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ borderColor: '#E8C99A' }}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt={t('apercu')} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#6B3D2E' }}>{t('categorie')} *</label>
                            <select 
                                className="form-select" 
                                name="id_categorie" 
                                value={formData.id_categorie} 
                                onChange={handleChange} 
                                required
                                style={{ borderColor: '#E8C99A' }}
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
                            <button type="submit" className="btn flex-grow-1" disabled={submitting} style={{ backgroundColor: '#6B3D2E', color: '#FDF6EE', border: 'none', borderRadius: '8px' }}>
                                {submitting ? t('modification_en_cours') : t('modifier_evenement_btn')}
                            </button>
                            <button type="button" className="btn" onClick={() => navigate(-1)} style={{ backgroundColor: '#E8C99A', color: '#6B3D2E', border: 'none', borderRadius: '8px' }}>
                                {t('annuler')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;