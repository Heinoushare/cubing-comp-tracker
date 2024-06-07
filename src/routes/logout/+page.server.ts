/** @type {import('./$types').PageServerLoad} */

import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
	cookies.delete('wca_id', { path: '/' });
    cookies.delete('email', { path: '/' });
    cookies.delete('password', { path: '/' });
    throw redirect(303, '/');
}