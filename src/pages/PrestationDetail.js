import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPrestationDetailByName } from '../services/api';

const PrestationDetail = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [prestation, setPrestation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPrestationDetail = async () => {
            // Vérifiez que le name est au bon format
            const validNameFormat = /^[a-z0-9-]+$/; // Regex pour valider le format
            if (!name || !validNameFormat.test(name)) {
                setError('Nom invalide pour la récupération de la prestation.');
                return;
            }

            try {
                const response = await fetchPrestationDetailByName(name);
                setPrestation(response);
            } catch (error) {
                setError('Erreur lors de la récupération des détails de la prestation.');
            }
        };

        getPrestationDetail();
    }, [name]);

    if (error) return <div>{error}</div>;
    if (!prestation) return <div>Loading...</div>;

    return (
        <div>
            <h2>{prestation.name}</h2>
            <p>{prestation.description}</p>
            <p>Prix : {prestation.price} €</p>
        </div>
    );
};

export default PrestationDetail;
