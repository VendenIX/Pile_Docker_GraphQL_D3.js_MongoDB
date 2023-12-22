// api.js
const BASE_URL = "http://127.0.0.1:4000/graphql";

async function fetchGraphQL(query, variables = {}) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables })
        });
        const json = await response.json();
        
        if (json.errors) {
            // S'il y a des erreurs dans la réponse GraphQL, lancez une erreur avec le message d'erreur
            throw new Error(json.errors[0].message);
        }
        return json.data;
    } catch (error) {
        throw error;
    }
}


export const fetchDepartments = () => {
    return fetchGraphQL(`{
        departments {
            id
            count
        }
    }`);
};

export const fetchDetailsDepartments = (prestationId, departmentId, minSum, maxSum) => {
  const query = `
    query Sales($prestationId: Int, $departmentId: Int, $minSum: Int, $maxSum: Int) {
      sales(
        prestationId: $prestationId,
        departmentId: $departmentId,
        minSum: $minSum,
        maxSum: $maxSum
      ) {
        departementId
        name
        prestationId
        prestationDescription
        sum
        avg
        count
        minSum
        maxSum
      }
    }
  `;

  const variables = {
    prestationId,
    departmentId,
    minSum,
    maxSum,
  };
  return fetchGraphQL(query, variables); // Appelez votre fonction de requête GraphQL avec la query et les variables.
};

export const fetchSalesByYears = (prestationId, departmentId, regionId) => {
  const query = `
    query Sales($prestationId: Int, $departmentId: Int, $regionId: Int) {
      nbSalesByTrimester(
        prestationId: $prestationId,
        departmentId: $departmentId,
        regionId: $regionId
      ) {
        count
        sum
        avg
        date {
          year
          trimester
          text
        }
      }
    }
  `;
  const variables = {
    prestationId,
    departmentId,
    regionId,
  };
  return fetchGraphQL(query, variables); // Appelez votre fonction de requête GraphQL avec la query et les variables.
}


export const fetchGeoJsonData = (url) => {
    return fetch(url).then(res => res.json());
};
