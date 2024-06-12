/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, params }) {

    let competition = await platform.env.DB.prepare(
        "SELECT * FROM competitions WHERE competition_id = ?"
    ).bind(params.competition_id).first();
    if (!competition) {
        return {error: "Invalid competition ID"}
    }


    
}