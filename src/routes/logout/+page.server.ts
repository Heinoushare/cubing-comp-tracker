/** @type {import('./$types').PageServerLoad} */

import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
	cookies.delete('username', { path: '/' });
    cookies.delete('email', { path: '/' });
    cookies.delete('password', { path: '/' });
    throw redirect(303, '/');
}