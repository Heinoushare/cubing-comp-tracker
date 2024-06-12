/** @type {import('./$types').Actions} */

import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, platform }) {
    if (!cookies.get("wca_id") || !cookies.get("email") || !cookies.get("password")) {
        return;
    }
	const user = await platform.env.DB.prepare(
        "SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?"
    ).bind(cookies.get("wca_id"), cookies.get("email"), cookies.get("password")).first();
    if (user) {
        throw redirect(303, "/");
    }
}

export const actions = {
	default: async ({cookies, request, platform}) => {
        const formData = await request.formData();
        const wca_idOrEmail = formData.get('wca_idOrEmail')?.toString();
        const password = formData.get('password')?.toString();

        if (!wca_idOrEmail || !password) {
            return {error: "Missing required fields"};
        }

        let loginIsValid = false;
        let wca_id = "";
        let email = "";

        // First check as if username
        let user = await platform.env.DB.prepare(
            "SELECT * FROM users WHERE wca_id = ? AND password = ?"
        ).bind(wca_idOrEmail, password).first();
        if (user) {
            loginIsValid = true;
            wca_id = user["wca_id"];
            email = user["email"];
        }

        user = await platform.env.DB.prepare(
            "SELECT * FROM users WHERE email = ? AND password = ?"
        ).bind(wca_idOrEmail, password).first();
        if (user) {
            loginIsValid = true;
            wca_id = user["wca_id"];
            email = user["email"];
        }

        if (!loginIsValid) {
            return {error: "Login data is invalid"}
        }

        let person;
        try {
            const response = await fetch("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/" + wca_id + ".json", {
                method: 'GET', // Set the method to GET
                headers: {
                    'Content-Type': 'application/json' // Set the headers appropriately
                }
            });

            person = await response.json();
            if (!response.ok) {
                return {error: "Invalid WCA ID"};
            }
        } catch (e) {
            console.log(e);
            return {error: "Invalid WCA ID"};
        }

        await platform.env.DB.prepare("DELETE FROM persons WHERE wca_id = ?").bind(wca_id).run();

        await platform.env.DB.prepare(
            "INSERT INTO persons (wca_id, name, numberOfCompetitions, competitionIds, rank, results) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(
            wca_id, person["name"], person["numberOfCompetitions"], person["competitionIds"].join(), JSON.stringify(person["rank"]), JSON.stringify(person["results"])
        ).run();

        cookies.set('wca_id', wca_id, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30});
        cookies.set('email', email, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30});
        cookies.set('password', password, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30});

        throw redirect(303, "/");
	}
};