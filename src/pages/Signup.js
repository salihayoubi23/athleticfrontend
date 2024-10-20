import React from 'react';
import { Form as BootstrapForm, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUser } from '../services/api';

const Signup = () => {
    const validationSchema = Yup.object({
        username: Yup.string().required('Nom d’utilisateur requis'),
        email: Yup.string().email('Email invalide').required('Email requis'),
        password: Yup.string().min(6, 'Doit contenir au moins 6 caractères').required('Mot de passe requis'),
    });

    const handleSubmit = async (values) => {
        try {
            await createUser(values);
            alert('Inscription réussie !');
        } catch (error) {
            alert('Erreur lors de l’inscription.');
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Formik
                initialValues={{ username: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <h2>Inscription</h2>
                    <Row className="mb-3">
                        <Col>
                            <BootstrapForm.Group controlId="formUsername">
                                <BootstrapForm.Label>Nom d’utilisateur</BootstrapForm.Label>
                                <Field name="username" className="form-control" />
                                <ErrorMessage name="username" component="div" className="text-danger" />
                            </BootstrapForm.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <BootstrapForm.Group controlId="formEmail">
                                <BootstrapForm.Label>Email</BootstrapForm.Label>
                                <Field name="email" type="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </BootstrapForm.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <BootstrapForm.Group controlId="formPassword">
                                <BootstrapForm.Label>Mot de passe</BootstrapForm.Label>
                                <Field name="password" type="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </BootstrapForm.Group>
                        </Col>
                    </Row>
                    <Button variant="dark" type="submit">S'inscrire</Button>
                </Form>
            </Formik>
        </Container>
    );
};

export default Signup;
