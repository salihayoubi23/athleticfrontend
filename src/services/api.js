import axios from 'axios';
import { ObjectId } from 'bson'; // Importation d'ObjectId pour valider
import moment from 'moment';

// Définir les bases d'URL pour chaque type d'API
const BACKEND_URL = 'https://athletic-backend.onrender.com';

const PRESTATIONS_API_URL = `${BACKEND_URL}/api/prestations`;
const RESERVATIONS_API_URL = `${BACKEND_URL}/api/reservations`;
const AUTH_API_URL = process.env.REACT_APP_API_URL || `${BACKEND_URL}/api/auth`;


// Fonction pour vérifier si l'ID est un ObjectId valide
const isValidObjectId = (id) => {
    return ObjectId.isValid(id);
};

// API pour l'authentification

// Inscription
export const createUser = async (data) => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/signup`, data);
        return response.data; // Retourne les données de réponse
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};

// Connexion

export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/login`, data);
        
        // Vérifiez si la réponse contient un token
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            
            // Stockez le nom d'utilisateur à partir de la réponse
            const username = response.data.username; // Récupérez le nom d'utilisateur
            localStorage.setItem('username', username); // Stockez le nom d'utilisateur
            console.log('Nom d\'utilisateur stocké :', username); // Affichez le nom d'utilisateur
             const userId = response.data.userId; // Récupérez l'ID utilisateur
            localStorage.setItem('userId', userId); // Stockez l'ID utilisateur
            console.log('ID utilisateur:', userId); // Vérifiez que l'ID utilisateur est bien récupéré

        }

        return response.data; // Retourne les données de réponse
    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};



// Déconnexion
export const logoutUser = () => {
    localStorage.removeItem('token'); // Supprime le token du localStorage
    localStorage.removeItem('username'); // Supprime le nom d'utilisateur du localStorage
    console.log('Utilisateur déconnecté avec succès.');
};

// Récupérer le profil utilisateur



export const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId'); // Récupérez l'ID utilisateur depuis le localStorage
    const token = localStorage.getItem('token'); // Récupérez le token depuis le localStorage

    if (!userId) {
        console.error("ID utilisateur non trouvé dans le localStorage.");
        return null; // Sortir si l'ID utilisateur n'est pas disponible
    }

    if (!token) {
        console.error("Token non trouvé dans le localStorage.");
        return null; // Sortir si le token n'est pas disponible
    }

    try {
        const response = await axios.get(`${AUTH_API_URL}/userprofil/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Ajoutez le token à l'en-tête
            }
        });
        console.log('Profil utilisateur récupéré:', response.data);
        return response.data; // Retournez les données de profil
    } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur:", error.response?.data || error.message);
        return null; // En cas d'erreur, retourner null
    }
};



export const fetchUserPaidReservations = async () => {
    const token = localStorage.getItem('token'); // Récupérer le token du stockage local
    if (!token) {
        throw new Error('Token manquant.');
    }

    try {
        const response = await axios.get(`${RESERVATIONS_API_URL}/reservations-paid`, {
            headers: {
                Authorization: `Bearer ${token}` // Ajouter le token à l'en-tête
            }
        });
        
        console.log('Réponse de l\'API pour les réservations payées:', response.data); // Log des données reçues

        return response.data.data || response.data; 
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations payées:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};


// Récupérer toutes les prestations
export const fetchAllPrestations = async () => {
    try {
        const response = await axios.get(PRESTATIONS_API_URL);
        return response.data; // Retourne les prestations
    } catch (error) {
        console.error('Erreur lors de la récupération des prestations:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};

// Récupérer les détails d'une prestation par ID
export const fetchPrestationDetail = async (id) => {
    try {
        if (!id || !isValidObjectId(id)) throw new Error('ID non valide pour la récupération de la prestation.');

        const response = await axios.get(`${PRESTATIONS_API_URL}/${id}`);
        return response.data; // Retourne les détails de la prestation
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la prestation:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};

// Récupérer les détails d'une prestation par nom
export const fetchPrestationDetailByName = async (name) => {
    try {
        if (!name) throw new Error('Nom manquant pour la récupération de la prestation.');

        const response = await axios.get(`${PRESTATIONS_API_URL}/name/${name}`);
        return response.data; // Retourne les détails de la prestation
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la prestation:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};

// Créer une nouvelle prestation
export const createPrestation = async (prestationData) => {
    try {
        const response = await axios.post(PRESTATIONS_API_URL, prestationData);
        return response.data; // Retourne les données de la prestation créée
    } catch (error) {
        console.error('Erreur lors de la création de la prestation:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};

// Supprimer une prestation
export const deletePrestation = async (id) => {
    try {
        if (!id || !isValidObjectId(id)) throw new Error('ID non valide pour la suppression de la prestation.');

        const response = await axios.delete(`${PRESTATIONS_API_URL}/${id}`);
        return response.data; // Retourne les données de la prestation supprimée
    } catch (error) {
        console.error('Erreur lors de la suppression de la prestation:', error.response?.data || error.message);
        throw error; // Relancer l'erreur pour la gestion plus haut
    }
};

// Effectuer le paiement d'une prestation
export const payForReservation = async (reservationId) => {
    const token = localStorage.getItem('token'); // Récupérer le token de l'utilisateur
    if (!token) {
        throw new Error('Token manquant.');
    }

    try {
        const response = await axios.post(`${RESERVATIONS_API_URL}/create-checkout-session`, 
        { reservationIds: [reservationId] }, 
        {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        // Retourner l'URL de Stripe pour la redirection
        return response.data;  // Devrait inclure l'URL de Stripe dans `response.data.url`
    } catch (error) {
        console.error('Erreur lors du paiement:', error.response?.data || error.message);
        throw error;
    }
};



// Fonction pour créer une réservation
export const createReservation = async (reservationData) => {
    const token = localStorage.getItem('token');  // Récupère le token depuis le localStorage

    console.log('Données de réservation envoyées :', reservationData);

    try {
        const response = await axios.post(`${RESERVATIONS_API_URL}`, reservationData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Envoie le token pour authentification
            }
        });

        console.log('Réservation créée avec succès:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error.response?.data || error.message);
        throw error;
    }
};








