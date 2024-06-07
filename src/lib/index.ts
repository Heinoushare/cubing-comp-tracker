// place files you want to imp

const URL = import.meta.env.VITE_URL;

export async function checkLogin(wca_id: any, email: any, password: any) {
    try {

        let requestData = {
            "wca_id": wca_id,
            "email": email,
            "password": password
        }

        const response = await fetch(URL + "/api/public/checkLogin", {
            method: 'POST', // Set the method to POST
            headers: {
                'Content-Type': 'application/json' // Set the headers appropriately
            },
            body: JSON.stringify(requestData) // Convert your data to JSON
        });
        let res = await response.json();
        return res["response"];
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * @param {string} url
 */
export function customRedirect(route: any) {
    window.location.href = URL + route;
}