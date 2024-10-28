import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../components/CartContext'; 
const Header = () => {
    const { cartItems } = useCart(); // Utilisez le contexte du panier pour obtenir les articles
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token'); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
            <Container>
                <Navbar.Brand href="/" className="text-warning">
                    Association Sportive
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="text-warning">Accueil</Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/userprofil" className="text-warning">
                                Mon Profil
                            </Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/cart" className="text-warning">
                            Mon Panier
                            {cartItems.length > 0 && (
                                <span className="badge bg-warning text-dark ms-2">
                                    {cartItems.length}
                                </span>
                            )}
                        </Nav.Link>
                        {!isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-warning">Se connecter</Nav.Link>
                                <Nav.Link as={Link} to="/signup" className="text-warning">Créer un compte</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link onClick={handleLogout} className="text-warning">Se déconnecter</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
