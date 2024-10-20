import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Importez useNavigate pour la redirection
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const navigate = useNavigate(); // Créez une instance de navigate

    const handleLogout = () => {
        // Videz le token du localStorage
        localStorage.removeItem('token');
        
        // Redirigez l'utilisateur vers la page d'accueil
        navigate('/');
    };

    const isAuthenticated = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est connecté

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
            <Container>
                <Navbar.Brand href="/" className="text-warning">
                    Association Sportive
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className="text-warning">
                            Accueil
                        </Nav.Link>
                        {isAuthenticated && ( // Lien vers le profil si l'utilisateur est connecté
                            <Nav.Link as={Link} to="/userprofil" className="text-warning">
                                Mon Profil
                            </Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/cart" className="text-warning"> {/* Lien vers le panier */}
                            Mon Panier
                        </Nav.Link>
                        {!isAuthenticated ? ( // Si l'utilisateur n'est pas authentifié
                            <>
                                <Nav.Link as={Link} to="/login" className="text-warning">
                                    Se connecter
                                </Nav.Link>
                                <Nav.Link as={Link} to="/signup" className="text-warning">
                                    Créer un compte
                                </Nav.Link>
                            </>
                        ) : ( // Si l'utilisateur est authentifié
                            <Nav.Link onClick={handleLogout} className="text-warning">
                                Se déconnecter
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
