/** @type {import('./$types').PageServerLoad} */


export async function load({ cookies, platform }) {

    let loggedIn;
    if (!cookies.get("wca_id") || !cookies.get("email") || !cookies.get("password")) {
        return {loggedIn: false};
    }
	const user = await platform.env.DB.prepare(
        "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
    ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
    if (!user) {
        loggedIn = false;
    }
    else {
        loggedIn = true;
    }

    return {loggedIn: loggedIn}
}