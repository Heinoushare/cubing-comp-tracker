/** @type {import('./$types').PageServerLoad} */
import { redirect } from '@sveltejs/kit';


export async function load({ cookies, platform, params }) {

	const user = await platform.env.DB.prepare(
        "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
    ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
    if (!user) {
        throw redirect(303, "/login");
    }

    let zone = await platform.env.DB.prepare(
        "SELECT * FROM competition_zones WHERE zone_id = ?"
    ).bind(parseInt(params.zone_id)).first();

    return {zone: zone};

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