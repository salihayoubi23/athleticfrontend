import React, { useState, createContext, useContext } from 'react';
import ObjectId from 'bson-objectid';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const isValidReservationId = (id) => {
        return typeof id === 'string' && ObjectId.isValid(id);
    };

    const addToCart = (reservation) => {
        if (!reservation || !reservation.reservationId || !reservation.prestation || !reservation.price) {
            console.error('Données de réservation invalides:', reservation);
            return;
        }

        if (!isValidReservationId(reservation.reservationId)) {
            console.error('reservationId non valide:', reservation.reservationId);
            return;
        }

        const isDuplicate = cartItems.some(item => 
            item.prestation === reservation.prestation && item.date === reservation.date
        );

        if (isDuplicate) {
            alert('Cette prestation est déjà dans le panier.');
            return;
        }

        setCartItems([...cartItems, reservation]);
    };

    const removeFromCart = (reservationId) => {
        setCartItems(cartItems.filter(item => item.reservationId !== reservationId));
    };

    const clearCart = () => {
        setCartItems([]); 
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
