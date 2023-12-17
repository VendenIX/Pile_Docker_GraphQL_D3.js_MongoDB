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

export const fetchGeoJsonData = (url) => {
    return fetch(url).then(res => res.json());
};
