import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import PrestationDetail from './pages/PrestationDetail';
import PrivateRoute from './components/PrivateRoute';
import { CartProvider } from './components/CartContext';
import Cart from './pages/Cart';
import Payment from './pages/payment';
import Success from './pages/Success'; 
import Cancel from './pages/Cancel'; 

function App() {
    return (
        <CartProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/userprofil" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                    <Route path="/prestation/:name" element={<PrestationDetail />} />
                    <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/success" element={<Success />} /> {/* Ajoutez la route pour Success */}
                    <Route path="/cancel" element={<Cancel />} /> {/* Ajoutez la route pour Cancel */}
                </Routes>
                <Footer />
            </Router>
        </CartProvider>
    );
}

export default App;
