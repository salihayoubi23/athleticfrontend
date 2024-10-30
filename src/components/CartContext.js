import React, { useState, createContext, useContext, useEffect } from 'react';
import ObjectId from 'bson-objectid';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CART_EXPIRATION_HOURS = 12;

const saveCartToLocalStorage = (cartItems) => {
    const timestamp = Date.now(); // Enregistre le moment actuel en millisecondes
    localStorage.setItem('cart', JSON.stringify({ cartItems, timestamp }));
};

const loadCartFromLocalStorage = () => {
    const cartData = JSON.parse(localStorage.getItem('cart'));
    if (!cartData) return [];

    const { cartItems, timestamp } = cartData;
    const now = Date.now();

    // Vérifiez si les 12 heures se sont écoulées
    if (now - timestamp > CART_EXPIRATION_HOURS * 60 * 60 * 1000) {
        localStorage.removeItem('cart'); // Supprimez le panier expiré
        return [];
    }
    return cartItems;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(loadCartFromLocalStorage);

    useEffect(() => {
        saveCartToLocalStorage(cartItems); // Sauvegarde automatique à chaque modification du panier
    }, [cartItems]);

    const addToCart = (reservation) => {
        if (!reservation || !reservation.reservationId || !reservation.prestation || !reservation.price) {
            console.error('Données de réservation invalides:', reservation);
            return;
        }

        const isDuplicate = cartItems.some(item => 
            item.prestation === reservation.prestation && item.date === reservation.date
        );

        if (isDuplicate) {
            alert('Cette prestation est déjà dans le panier.');
            return;
        }

        const updatedCart = [...cartItems, reservation];
        setCartItems(updatedCart);
    };

    const removeFromCart = (reservationId) => {
        const updatedCart = cartItems.filter(item => item.reservationId !== reservationId);
        setCartItems(updatedCart);
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
