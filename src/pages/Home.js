import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Bienvenue sur notre site !</h2>
            <p className="text-center">Découvrez nos prestations :</p>
            <Row className="g-4">
                <Col md={4} className="mb-4">  {/* Marge en bas */}
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Prestation Du Lundi</Card.Title>
                            <Card.Text>
                                Découvrez notre première prestation exceptionnelle qui vous aidera à atteindre vos objectifs sportifs.
                            </Card.Text>
                            <Button as={Link} to="/prestation/prestation-du-lundi" variant="primary">
                                Voir plus
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">  {/* Marge en bas */}
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Prestation Du Mercredi</Card.Title>
                            <Card.Text>
                                La deuxième prestation met l'accent sur des techniques avancées pour améliorer vos performances.
                            </Card.Text>
                            <Button as={Link} to="/prestation/prestation-du-mercredi" variant="primary">
                                Voir plus
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">  {/* Marge en bas */}
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Prestation Du Dimanche</Card.Title>
                            <Card.Text>
                                Profitez de notre troisième prestation pour un accompagnement personnalisé et des conseils experts.
                            </Card.Text>
                            <Button as={Link} to="/prestation/prestation-du-dimanche" variant="primary">
                                Voir plus
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
