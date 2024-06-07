/** @type {import('@sveltejs/kit').RequestHandler} */

export async function POST({request, platform }) {

    let data = await request.json();

    let wca_id = data.wca_id;
    let email = data.email;
    let password = data.password;
    if (!wca_id || !email || !password) {
        return new Response(JSON.stringify({"response": false}));
    }

    let result = await platform.env.DB.prepare("SELECT * FROM users WHERE wca_id = ? AND email = ? AND password = ?").bind(wca_id, email, password).first();

    if (!result) {
        return new Response(JSON.stringify({"response": false}), { status: 401 });
    }

    return new Response(JSON.stringify({"response": true}));
}