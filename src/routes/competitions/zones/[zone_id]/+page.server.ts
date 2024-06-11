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

    let competitionsPromise = await platform.env.DB.prepare("SELECT * FROM competitions").all();
    let competitions = await competitionsPromise["results"];

    let competitionsInZone = [];
    const lat1 = zone["latitude"];
    const lon1 = zone["longitude"];
    let radius = zone["radius"];

    // Convert radius to meters
    if (zone["radius_units"] === "kilometers") {
        radius *= 1000;
    }
    else if (zone["radius_units"] === "miles") {
        radius *= 1609.344
    }

    for (let i in competitions) {
        const lat2 = competitions[i]["venue_latitude"];
        const lon2 = competitions[i]["venue_longitude"];
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        let d = R * c; // in metres

        if (d <= radius) {
            competitionsInZone.push(competitions[i]);

            if (zone["radius_units"] === "kilometers") {
                d /= 1000;
            }
            else if (zone["radius_units"] === "miles") {
                d /= 1609.344
            }
            d = Math.round(d * 10) / 10
            competitionsInZone[competitionsInZone.length - 1]["distance"] = d.toString() + " " + zone["radius_units"];
        }
    }
    return {zone: zone, competitions: competitionsInZone};

}

export const actions = {
    default: async ({cookies, request, platform, params}) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString()
        const latitude = parseFloat(formData.get('latitude'));
        const longitude = parseFloat(formData.get('longitude'));
        const radius = parseFloat(formData.get('radius'));
        const unit = formData.get('unit')?.toString();

        if (!name || !latitude || !longitude || !radius || !unit) {
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
            "UPDATE competition_zones SET name = ?, latitude = ?, longitude = ?, radius = ?, radius_units = ? WHERE zone_id = ?"
        ).bind(name, latitude, longitude, radius, unit, params.zone_id).run();

        throw redirect(303, '/competitions/zones/' + params.zone_id);
    }
}