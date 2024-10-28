import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import { payForReservation , createReservation } from '../services/api';

const Payment = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handlePayment = async () => {
            try {
                if (cartItems.length === 0) {
                    alert('Aucune prestation à payer.');
                    navigate('/cart'); // Redirige vers le panier
                    return;
                }

                // Logique pour créer une réservation ici
                const reservationData = {
                    prestations: cartItems.map(item => ({
                        prestationId: item.prestationId,
                        name: item.prestation,
                        price: item.price,
                        date: item.date
                    })),
                    user: localStorage.getItem('userId')
                };

                // Créer la réservation
                const reservationResponse = await createReservation(reservationData);
                console.log('Réservation créée:', reservationResponse);

                // Appeler l'API de paiement
                const paymentResponse = await payForReservation(reservationResponse.reservationId);
                console.log('Réponse de paiement:', paymentResponse);

                // Rediriger vers Stripe
                window.location.href = paymentResponse.url;
                clearCart(); // Vider le panier après le succès
            } catch (error) {
                console.error('Erreur lors du paiement:', error);
                alert('Erreur lors du traitement du paiement : ' + error.message);
            }
        };

        handlePayment();
    }, [cartItems, navigate, clearCart]);

    return (
        <div>
            <h1>Paiement en cours...</h1>
            <p>Merci de patienter.</p>
        </div>
    );
};

export default Payment;
