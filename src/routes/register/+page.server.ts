/** @type {import('./$types').Actions} */

import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const loggedIn = await checkLogin(cookies.get('username'), cookies.get('email'), cookies.get('password'));
	if (loggedIn) {
        throw redirect(303, '/');
    }
}

export const actions = {
	default: async ({cookies, request}) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!username || !email || !password || !confirmPassword) {
            return {"error": "Missing required fields"};
        }
        if (password != confirmPassword) {
            return {"error": "Passwords do not match"};
        }

        // TODO: check if email is valid

        await platform.env.DB.prepare(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        ).run();

        cookies.set('username', username);
        cookies.set('email', email);
        cookies.set('password', password);

        throw redirect(303, '/');
	}
};