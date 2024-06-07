import type { RequestHandler } from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').RequestHandler} */
import type { D1Database } from '@cloudflare/workers-types';

const API_KEY = import.meta.env.VITE_API_KEY;

export async function POST({request, platform }) {

    let data = await request.json();

    if (data.key !== API_KEY) {
        return new Response("Invalid API key", { status: 400 });
    }

    let wca_id = data.wca_id;
    let email = data.email;
    let password = data.password;
    if (!wca_id || !email || !password) {
        return new Response("Missing required fields", { status: 400 });
    }

    let result = await platform.env.DB.prepare(
        "INSERT INTO users (wca_id, email, password) VALUES (?, ?, ?)"
    ).bind(wca_id, email, password).run();
    return new Response(JSON.stringify(result));
}

export async function GET({ request, platform }) {

    let data = await request.json();

    if (data.key !== API_KEY) {
        return new Response("Invalid API key", { status: 400 });
    }

    let id = data.id;
    let wca_id = data.wca_id;
    let email = data.email;
    let password = data.password;

    let result;

    if (!id && !wca_id && !email && !password) {
        return new Response("Missing required fields", { status: 400 });
    }

    else if (id) {
        result = await platform.env.DB.prepare("SELECT * FROM users").all();
    }
    else if (wca_id) {
        result = await platform.env.DB.prepare("SELECT * FROM users WHERE wca_id = ?").bind(wca_id).all();
    }
    else if (email) {
        result = await platform.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).all();
    }
    else if (password) {
        result = await platform.env.DB.prepare("SELECT * FROM users WHERE password = ?").bind(password).all();
    }

    return new Response(JSON.stringify(result));
}