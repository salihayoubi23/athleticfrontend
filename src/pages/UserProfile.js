import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Table, ListGroup } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';
import { fetchUserPaidReservations, fetchUserProfile } from '../services/api';
import { useCart } from '../components/CartContext';
import ObjectId from 'bson-objectid';
//import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

  // Fonction pour surligner les dates avec prestations
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
        const reservationDates = reservations.map(reservation => moment(reservation.date).format('YYYY-MM-DD'));
        if (reservationDates.includes(moment(date).format('YYYY-MM-DD'))) {
            return 'highlight';
        }
    }
    return null;
};

// Obtenir les prestations pour une date donnée
const getPrestationsForDate = (date) => {
    const selectedDateStr = moment(date).format('YYYY-MM-DD');
    return reservations.filter(reservation => 
        moment(reservation.date).format('YYYY-MM-DD') === selectedDateStr
    );
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

                <h2 className="text-center text-warning mb-4">Calendrier des prestations</h2>
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName={getTileClassName} // Surligne les dates avec prestations
                />

                {selectedDate && (
                    <div className="mt-4">
                        <h3 className="text-warning">
                            Prestations pour le {moment(selectedDate).format('dddd, LL')}
                        </h3>
                        <ListGroup variant="flush">
                            {getPrestationsForDate(selectedDate).map((reservation, index) => (
                                <ListGroup.Item key={index} className="bg-secondary text-white mb-2">
                                    <strong>{reservation.prestation.name}</strong> - {reservation.prestation.price}€
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Col>
        </Row>
    </Container>
);
};

export default UserProfile;