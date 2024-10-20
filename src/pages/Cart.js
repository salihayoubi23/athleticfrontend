import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { Button, ListGroup, Container } from 'react-bootstrap';
import axios from 'axios';
import { createReservation, payForReservation } from '../services/api'; 
import moment from 'moment';  // Importer moment pour formater les dates au format ISO

const Cart = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    const token = localStorage.getItem('token');

    // Gestion du paiement et envoi des réservations avec dates associées
    const handleCheckout = async () => {
        try {
            if (cartItems.length === 0) {
                alert('Aucune prestation à payer.');
                return;
            }
    
           
    
            // Préparer les données des prestations
            const reservationData = {
                prestations: cartItems.map(item => ({
                    prestationId: item.prestationId,
                    name: item.prestation,
                    price: item.price,
                    date: moment(item.date).toISOString()
                })),
                
            };
    
            // Appeler l'API pour créer la réservation
            const reservationResponse = await createReservation(reservationData);
            console.log('Réservation créée:', reservationResponse);
    
            // Appeler l'API de paiement Stripe
            const paymentResponse = await payForReservation(reservationResponse.reservationId);
            console.log('Réponse de paiement:', paymentResponse);
    
            // Rediriger vers l'URL Stripe
            if (paymentResponse.url) {
                window.location.href = paymentResponse.url;  // Redirection vers Stripe
            } else {
                console.error('Erreur: URL de paiement manquante.');
            }
    
            clearCart(); // Vider le panier après le succès
        } catch (error) {
            console.error('Erreur lors du paiement:', error.response?.data || error.message);
            alert('Erreur lors du traitement du paiement : ' + error.message);
        }
    };
    
    

    // Confirmation avant de supprimer un article du panier
    const confirmRemoveFromCart = (reservationId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article du panier ?')) {
            removeFromCart(reservationId);
        }
    };

    return (
        <Container className="my-5 p-4" style={{ backgroundColor: '#111', borderRadius: '8px' }}>
            <h2 className="text-white">Mon Panier</h2>
            {cartItems.length > 0 ? (
                <ListGroup className="mb-4">
                    {cartItems.map((item) => (
                        <ListGroup.Item key={item.reservationId} className="bg-dark text-white mb-2">
                            {item.prestation} - {item.price.toFixed(2)} euros - {moment(item.date).format('dddd, LL')}
                            <Button 
                                variant="danger" 
                                className="float-end"
                                onClick={() => confirmRemoveFromCart(item.reservationId)}
                            >
                                Supprimer
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="text-white">Votre panier est vide.</p>
            )}
            <h3 className="text-warning">Prix total: {totalPrice} euros</h3>
            {cartItems.length > 0 && (
                <Button variant="success" onClick={handleCheckout}>
                Procéder au paiement
            </Button>
            
            )}
        </Container>
    );
};

export default Cart;