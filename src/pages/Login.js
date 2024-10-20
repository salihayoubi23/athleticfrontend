import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Login = () => {
    const navigate = useNavigate();
    
    // Schéma de validation
    const validationSchema = Yup.object({
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string().required('Mot de passe requis'),
    });

    const handleSubmit = async (values) => {
        console.log("Submitting login form with values:", values); // Log des valeurs soumises
        try {
            const response = await loginUser(values);
            console.log("Login response:", response); // Log de la réponse de connexion

            // Vérifiez si le token existe maintenant
            if (response.token) {
                console.log("Token stored:", response.token); // Log du token stocké
                alert('Connexion réussie !');
                navigate('/userprofil'); // Redirection vers la page de profil
            } else {
                console.log("Erreur: Token non reçu."); // Log si le token n'est pas reçu
                alert('Erreur: Token non reçu.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion.';
            console.error("Error during login:", errorMessage); // Log de l'erreur
            alert(errorMessage); // Alerte à l'utilisateur
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-100">
                <Col xs={12} md={8} lg={6} xl={4} className="mx-auto"> {/* Responsive sizing */}
                    <Card className="p-4 shadow">
                        <h2 className="text-center mb-4">Connexion</h2>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <Field name="email" type="email" className="form-control" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mot de passe</label>
                                    <Field name="password" type="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </div>
                                <Button type="submit" className="w-100 btn-dark">Se connecter</Button>
                            </Form>
                        </Formik>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
