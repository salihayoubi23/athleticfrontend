import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Table } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';
import { fetchUserPaidReservations, fetchUserProfile } from '../services/api';
import { useCart } from '../components/CartContext';
import ObjectId from 'bson-objectid';

const prestationsData = {
    'prestation-du-mercredi': {
        _id: "66f87fdf253a3e181921acf1",
        name: "Prestation Du Mercredi",
        price: 150,
    },
    'prestation-du-dimanche': {
        _id: "66f87fdf253a3e181921acf2",
        name: "Prestation Du Dimanche",
        price: 200,
    },
    'prestation-du-lundi': {
        _id: "66f87fdf253a3e181921acf0",
        name: "Prestation Du Lundi",
        price: 100,
    }
};

const UserProfile = () => {
    const { cartItems, addToCart } = useCart();
    const [selectedDays, setSelectedDays] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [username, setUsername] = useState(''); 
    const [error, setError] = useState(null); 
    const PRICE = 3;

    moment.locale('fr');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token manquant, redirection vers la page de connexion.');
            window.location.href = '/login';
            return;
        }

        const fetchData = async () => {
            try {
                const profileData = await fetchUserProfile();
                setUsername(profileData.username);
        
                const reservationsData = await fetchUserPaidReservations();
                console.log('Données de réservations récupérées:', reservationsData); // Log des données récupérées

                setReservations(reservationsData.data);
        
            } catch (error) {
                setError('Erreur lors de la récupération des données.');
            }
        };
        
        fetchData(); 
    }, []);

    useEffect(() => {
        if (selectedDays.length > 0) {
            generateAvailableDates();
        } else {
            setAvailableDates([]);
        }
    }, [selectedDays]);

    const handleDaySelection = (day) => {
        setSelectedDays(prevDays => 
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };

    const generateAvailableDates = () => {
        const dates = [];
        const startDate = moment();
        const endDate = moment().add(1, 'months');

        while (startDate.isBefore(endDate)) {
            if (selectedDays.includes(startDate.format('dddd').toLowerCase())) {
                dates.push(startDate.clone());
            }
            startDate.add(1, 'days');
        }

        setAvailableDates(dates);
    };

    const handleAddToCart = (date, prestationSlug) => {
        const prestation = prestationsData[prestationSlug];  // Récupérer la prestation par son slug
    
        if (!prestation || !date) {
            alert('Erreur: Prestation ou date non définie.');
            return;
        }
    
        const formattedDate = moment(date).toISOString();  // Formater la date au format ISO
        const reservationId = new ObjectId().toString();   // Générer un ID unique pour la réservation
    
        // Ajouter l'article au panier avec la date spécifique
        addToCart({
            reservationId: reservationId,
            date: formattedDate,  // Inclure la date ici
            day: moment(date).format('dddd'),  // Jour au format texte
            prestation: prestation.name,       // Nom de la prestation
            price: prestation.price,           // Prix de la prestation
            prestationId: prestation._id       // ID de la prestation
        });
    };

    return (
        <Container className="my-5 p-4" style={{ backgroundColor: '#111', borderRadius: '8px' }}>
            <Row className="justify-content-center">
                <Col md={8}>
                    {error ? (
                        <h2 className="text-center text-danger mb-4">{error}</h2>
                    ) : (
                        <h2 className="text-center text-warning mb-4">Bienvenue, {username}</h2>
                    )}

                    <h2 className="text-center text-warning mb-4">Mes réservations payées</h2>
                    {Array.isArray(reservations) && reservations.length > 0 ? (
                        <ListGroup className="mb-4">
                            {reservations.map((reservation) => (
                                <ListGroup.Item key={reservation.reservationId} className="bg-dark text-white mb-2">
                                    <h5 className="text-warning">
                                        {moment(reservation.createdAt).format('dddd, LL')} :
                                    </h5>
                                    <ListGroup variant="flush">
                                        {reservation.prestations.map((prestation, index) => (
                                            <ListGroup.Item key={index} className="bg-secondary text-white">
                                                <strong>{prestation.name}</strong> - {prestation.price}€<br />
                                                <small>
                                                    {moment(prestation.date).format('dddd, LL')}
                                                </small>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-center text-white">Vous n'avez aucune réservation payée.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;