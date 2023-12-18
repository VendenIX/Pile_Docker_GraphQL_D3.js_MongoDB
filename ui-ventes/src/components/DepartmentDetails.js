import React, { useEffect, useState } from 'react';
import { fetchDetailsDepartments } from '../services/api'; // Importez la fonction de requête que vous avez créée

const DepartmentDetails = ({ departmentId }) => {
    const [departmentData, setDepartmentData] = useState(null);

    useEffect(() => {
        // Fonction pour récupérer les données du département en utilisant l'ID
        const fetchData = async () => {
            try {
                const result = await fetchDetailsDepartments(
                    undefined, // Vous n'avez pas besoin de prestationId ici, donc laissez-le à null
                    departmentId, // Utilisez l'ID du département comme paramètre
                    undefined, // Laissez minSum à null
                    undefined // Laissez maxSum à null
                );

                // Mettez à jour l'état avec les données du département
                setDepartmentData(result.sales);
            } catch (error) {
                console.error("Erreur lors de la récupération des données du département :", error);
            }
        };

        // Appelez la fonction fetchData
        fetchData();
    }, [departmentId]);

    // Si les données n'ont pas encore été chargées, affichez un message de chargement
    if (!departmentData) {
        console.log("Mais pourtant mon id était ", departmentId)
        return <div>Chargement en cours...</div>;
    }

    // Maintenant, vous pouvez utiliser les données pour afficher les détails du département
    return (
        <div>
            <h2>Département {departmentId}</h2>
            <ul>
                {departmentData.map((data, index) => (
                    <li key={index}>
                        <b>Nom de la prestation :</b> {data.prestationDescription}<br />
                        <b>Sum :</b> {data.sum}<br />
                        <b>Avg :</b> {data.avg}<br />
                        <b>Count :</b> {data.count}<br />
                        <b>Min Sum :</b> {data.minSum}<br />
                        <b>Max Sum :</b> {data.maxSum}<br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DepartmentDetails;
