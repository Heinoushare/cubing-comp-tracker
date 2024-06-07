/** @type {import('./$types').Actions} */

import { redirect } from '@sveltejs/kit';
import { checkLogin } from '$lib/index';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const loggedIn = await checkLogin(cookies.get('wca_id'), cookies.get('email'), cookies.get('password'));
	if (loggedIn) {
        throw redirect(303, '/');
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