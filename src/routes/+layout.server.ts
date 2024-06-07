/** @type {import('./$types').PageServerLoad} */
import { checkLogin } from '$lib/index';

export async function load({ cookies }) {
	const loggedIn = await checkLogin(cookies.get('wca_id'), cookies.get('email'), cookies.get('password'));
	return {
        loggedIn: loggedIn,
    }
}