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
        const wca_id = formData.get('wca_id')?.toString();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirmationPassword')?.toString();

        if (!wca_id || !email || !password || !confirmPassword) {
            return {error: "Missing required fields"};
        }
        if (password != confirmPassword) {
            return {error: "Passwords do not match"};
        }

        // TODO: check if email is valid

        await platform.env.DB.prepare(
            "INSERT INTO users (wca_id, email, password) VALUES (?, ?, ?)"
        ).bind(wca_id, email, password).run();

        cookies.set('wca_id', wca_id, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30});
        cookies.set('email', email, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30});
        cookies.set('password', password, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30});

        throw redirect(303, '/');
	}
};