import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Table, ListGroup } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/fr';
import { fetchUserPaidReservations, fetchUserProfile } from '../services/api';
import { useCart } from '../components/CartContext';
import ObjectId from 'bson-objectid';

const prestationsData = {
    'prestation-du-mercredi': { _id: "66f87fdf253a3e181921acf1", name: "Prestation Du Mercredi", price: 150 },
    'prestation-du-dimanche': { _id: "66f87fdf253a3e181921acf2", name: "Prestation Du Dimanche", price: 200 },
    'prestation-du-lundi': { _id: "66f87fdf253a3e181921acf0", name: "Prestation Du Lundi", price: 100 }
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
        const prestation = prestationsData[prestationSlug];
        if (!prestation || !date) {
            alert('Erreur: Prestation ou date non définie.');
            return;
        }
        const formattedDate = moment(date).toISOString();
        const reservationId = new ObjectId().toString();
        addToCart({
            reservationId: reservationId,
            date: formattedDate,
            day: moment(date).format('dddd'),
            prestation: prestation.name,
            price: prestation.price,
            prestationId: prestation._id
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
                        <ListGroup variant="flush">
                            {reservations.map((reservation) => (
                                <ListGroup.Item key={reservation._id} className="bg-dark text-white my-2 p-3 rounded">
                                    <h5 className="text-warning">
                                        {moment(reservation.date).format('dddd, LL')} :
                                    </h5>
                                    {reservation.prestations.map((prestation, index) => (
                                        <div key={index} className="ml-3">
                                            <strong>{prestation.name}</strong> - {prestation.price}€ - {moment(prestation.date).format('LL')}
                                        </div>
                                    ))}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-center text-white">Vous n'avez aucune réservation payée.</p>
                    )}
                    
                    <h2 className="text-center text-white mb-4">Sélectionner plusieurs jours de la semaine</h2>
                    <Form className="my-3 text-white">
                        {['lundi', 'mercredi', 'dimanche'].map((day) => (
                            <Form.Check
                                key={day}
                                type="checkbox"
                                label={day.charAt(0).toUpperCase() + day.slice(1)}
                                checked={selectedDays.includes(day)}
                                onChange={() => handleDaySelection(day)}
                                className="mb-2"
                                style={{ color: '#fff' }}
                            />
                        ))}
                    </Form>

                    <h3 className="text-center text-warning mt-4">Dates disponibles</h3>
                    {availableDates.length > 0 ? (
                        <Row className="justify-content-center mt-3">
                            {availableDates.map((date, index) => (
                                <Col key={index} md={4} className="mb-3">
                                    <div className="p-3 text-center rounded" style={{ backgroundColor: '#ffc107', color: '#111', border: '1px solid #fff' }}>
                                        <p>{date.format('dddd, LL')}</p>
                                        <p>Prix: {PRICE} euros</p>
                                        <Button 
                                            variant="dark" 
                                            onClick={() => handleAddToCart(date, 'prestation-du-' + date.format('dddd').toLowerCase())}
                                        >
                                            Ajouter au panier
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p className="text-center text-white mt-4">Aucune date disponible, veuillez sélectionner un jour.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
