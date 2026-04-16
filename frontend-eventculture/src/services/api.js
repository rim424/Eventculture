import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token récupéré:', token ? 'Oui' : 'Non');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token ajouté à la requête:', config.url);
        } else {
            console.warn('Aucun token pour:', config.url);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => {
        console.log('Réponse reçue:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('Erreur réponse:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// ============ AUTHENTIFICATION ============
export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const logout = () => api.post('/logout');
export const getMe = () => api.get('/me');

// ============ ÉVÉNEMENTS ============
export const getEvenements = () => api.get('/evenements');
export const getEvenement = (id) => api.get(`/evenements/${id}`);
export const createEvenement = (data) => api.post('/evenements', data);
export const updateEvenement = (id, data) => api.put(`/evenements/${id}`, data);
export const deleteEvenement = (id) => api.delete(`/evenements/${id}`);

// ============ RÉSERVATIONS ============
export const reserver = (data) => api.post('/reservations', data);
export const annulerReservation = (id) => api.put(`/reservations/${id}/annuler`);
export const getMesReservations = () => api.get('/mes-reservations');

// ============ CATÉGORIES ============
export const getCategories = () => api.get('/categories');

// ============ COMMENTAIRES ============
export const getCommentaires = (evenementId) => api.get(`/commentaires/${evenementId}`);
export const ajouterCommentaire = (evenementId, data) => api.post(`/commentaires/${evenementId}`, data);
export const getMoyenne = (evenementId) => api.get(`/moyenne/${evenementId}`);

// ============ DASHBOARD ============
export const getDashboardOrganisateur = () => api.get('/dashboard/organisateur');
export const getDashboardAdmin = () => api.get('/dashboard/admin');

export default api;