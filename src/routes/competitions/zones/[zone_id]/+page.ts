/** @type {import('./$types').PageLoad} */
export async function load({ fetch, data }) {

    let radiusInMeters = data.zone["radius"];

    if (data.zone["radius_units"] === "kilometers") {
        radiusInMeters *= 1000;
    }
    else if (data.zone["radius_units"] === "miles") {
        radiusInMeters *= 1609.344
    }

    let competitionsInZone = [];
    const lat1 = data.zone["latitude"];
    const lon1 = data.zone["longitude"];
    for (let i = 6; i <= 12; i++) {
        try {


            let month = i.toString();
            if (i < 10) {
                month = "0" + month
            }
            const response = await fetch(import.meta.env.VITE_WCA_API_URL + "/competitions/2024/" + month + ".json", {
                method: 'GET', // Set the method to GET
                headers: {
                    'Content-Type': 'application/json' // Set the headers appropriately
                }
            });

            let res = await response.json();
            let comps = res["items"];
            for (let j = comps.length - 1; j >= 0; j--) {
                const lat2 = comps[j]["venue"]["coordinates"]["latitude"];
                const lon2 = comps[j]["venue"]["coordinates"]["longitude"];
                const R = 6371e3; // metres
                const φ1 = lat1 * Math.PI/180; // φ, λ in radians
                const φ2 = lat2 * Math.PI/180;
                const Δφ = (lat2-lat1) * Math.PI/180;
                const Δλ = (lon2-lon1) * Math.PI/180;

                const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                const d = R * c; // in metres

                if (d <= radiusInMeters) {
                    competitionsInZone.push(comps[j]);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    return {zone: data.zone, competitions: competitionsInZone};
}