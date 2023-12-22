import React, { useEffect, useState } from 'react';
import { fetchDetailsDepartments } from '../services/api'; // Importez la fonction de requête que vous avez créée
import '../styles/global.css';
const DepartmentDetails = ({ departmentId , nameDepartment}) => {
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
        return <div>Chargement en cours...</div>;
    }

    // Maintenant, vous pouvez utiliser les données pour afficher les détails du département
    return (
        <div>
          <h1>{nameDepartment} ({departmentId})</h1>
          {departmentData.map((data, index) => (
            <div key={index} className="department-category">
              <h3>{data.prestationDescription}</h3>
              <div className="category-details">
                <div>
                  <p><b>Sum:</b> {data.sum}</p>
                  <p><b>Avg:</b> {data.avg.toFixed(2)}</p>
                </div>
                <div>
                  <p><b>Count:</b> {data.count}</p>
                  <p><b>Min Sum:</b> {data.minSum}</p>
                  <p><b>Max Sum:</b> {data.maxSum}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
      
};

export default DepartmentDetails;
