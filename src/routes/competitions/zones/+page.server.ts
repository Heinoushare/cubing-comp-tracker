/** @type {import('./$types').PageServerLoad} */
import { redirect } from '@sveltejs/kit';


export async function load({ cookies, platform }) {

    if (!cookies.get("wca_id") || !cookies.get("email") || !cookies.get("password")) {
        throw redirect(303, "/login");
    }

	const user = await platform.env.DB.prepare(
        "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
    ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
    if (!user) {
        throw redirect(303, "/login");
    }

    let zones = await platform.env.DB.prepare(
        "SELECT * FROM competition_zones WHERE user_id = ?"
    ).bind(user["id"]).all();

    return {zones: zones.results}

}

export const actions = {
    create: async ({cookies, request, platform}) => {
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
            "INSERT INTO competition_zones (user_id, latitude, longitude, radius, radius_units) VALUES (?, ?, ?, ?, ?)"
        ).bind(user["id"], latitude, longitude, radius, unit).run();

        throw redirect(303, '/competitions/zones');
    },

    delete: async ({cookies, request, platform}) => {
        const formData = await request.formData();
        const zone_id = parseInt(formData.get('zone_id'));
        if (!zone_id) {
            return {error: "Missing required fields"};
        }

        const user = await platform.env.DB.prepare(
            "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
        ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
        if (!user) {
            throw redirect(303, "/login");
        }
    
        let zone = await platform.env.DB.prepare(
            "SELECT * FROM competition_zones WHERE zone_id = ?"
        ).bind(zone_id).first();

        if (zone["user_id"] != user["id"]) {
            return {error: "Please don't try to cause trouble"};
        }

        await platform.env.DB.prepare(
            "DELETE FROM competition_zones WHERE zone_id = ?"
        ).bind(zone_id).run();

        throw redirect(303, "/competitions/zones")

    }
}