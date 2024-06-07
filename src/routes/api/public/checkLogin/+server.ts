/** @type {import('@sveltejs/kit').RequestHandler} */

export async function POST({request, platform }) {

    let data = await request.json();

    let username = data.username;
    let email = data.email;
    let password = data.password;
    if (!username || !email || !password) {
        return new Response(JSON.stringify({"response": false}));
    }

    let result = await platform.env.DB.prepare("SELECT * FROM users WHERE username = ? AND email = ? AND password = ?").bind(username, email, password).first();

    if (!result) {
        return new Response(JSON.stringify({"response": false}), { status: 401 });
    }

    return new Response(JSON.stringify({"response": false}));
}