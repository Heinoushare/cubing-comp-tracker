/** @type {import('./$types').PageServerLoad} */
import { redirect } from '@sveltejs/kit';


export async function load({ cookies, platform, params }) {

    if (!cookies.get("wca_id") || !cookies.get("email") || !cookies.get("password")) {
        throw redirect(303, "/login");
    }

	const user = await platform.env.DB.prepare(
        "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
    ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
    if (!user) {
        throw redirect(303, "/login");
    }

    let zone = await platform.env.DB.prepare(
        "SELECT * FROM competition_zones WHERE zone_id = ?"
    ).bind(parseInt(params.zone_id)).first();

    let competitionsInZone = [];

    const lat1 = zone["latitude"];
    const lon1 = zone["longitude"];
    let radius = zone["radius"];
    if (zone["radius_units"] === "kilometers") {
        radius *= 1000;
    }
    else if (zone["radius_units"] === "miles") {
        radius *= 1609.344
    }
    for (let i = 6; i <= 12; i++) {
        try {


            let month = i.toString();
            if (i < 10) {
                month = "0" + month
            }
            const response = await fetch(import.meta.env.VITE_WCA_API_URL + "/competitions/2024/" + month + ".json", {
                method: 'GET', // Set the method to POST
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

                if (d <= radius) {
                    competitionsInZone.push(comps[j]);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    return {competitionsInZone: competitionsInZone, zone: zone};

}

export const actions = {
    default: async ({cookies, request, platform, params}) => {
        const formData = await request.formData();
        const latitude = parseFloat(formData.get('latitude'));
        const longitude = parseFloat(formData.get('longitude'));
        const radius = parseFloat(formData.get('radius'));
        const unit = formData.get('unit')?.toString();

        if (!latitude || !longitude || !radius || !unit) {
            return {error: "Missing required fields"};
        }
        if (unit != "miles" && unit != "kilometers") {
            return {error: "Invalid units of distance"}
        }

        // TODO: check if data is valid

        const user = await platform.env.DB.prepare(
            "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
        ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
        if (!user) {
            throw redirect(303, "/login");
        }

        await platform.env.DB.prepare(
            "UPDATE competition_zones SET latitude = ?, longitude = ?, radius = ?, radius_units = ? WHERE zone_id = ?"
        ).bind(latitude, longitude, radius, unit, params.zone_id).run();

        throw redirect(303, '/competitions/zones');
    }
}