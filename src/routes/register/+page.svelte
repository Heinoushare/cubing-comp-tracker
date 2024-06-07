
<script lang="ts">

    import { checkLogin, customRedirect } from '$lib';
    import Cookies from 'js-cookie';
    // import { onMount } from 'svelte';

    const URL = import.meta.env.VITE_URL;

    let userame = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

    // let username = Cookies.get("username");
    // let email = Cookies.get("email");
    // let password = Cookies.get("password");

    // onMount( async () => {
    //     if (username && email && password) {
    //         let loggedIn = await checkLogin(username, email, password);
    //         if (loggedIn) {
    //             customRedirect("/")
    //         }
    //         else {
    //             username = "";
    //             email = "";
    //             password = "";
    //         }
    //     }
    // });

    let errorMsg = "";

    async function register() {

        try {

            let requestData = {
                "username": username,
                "email": email,
                "password": password,
                "confirmPassword": confirmPassword
            }

            const response = await fetch(BACKEND_URL + "/register", {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json' // Set the headers appropriately
                },
                body: JSON.stringify(requestData) // Convert your data to JSON
            });

            let res = await response.json();
            if (response.ok) {
                Cookies.set("username", username, {"expires": 30});
                Cookies.set("password", password, {"expires": 30});
                Cookies.set("dark", "false", {"expires": 30});
                Cookies.set("theme", "rebels", {"expires": 30});
                customRedirect(FRONTEND_URL);
            }
            errorMsg = res["message"];
        } catch (e) {
            console.log(e);
        }
    }

</script>

<svelte:head>
  <title>CCT: Register</title>
</svelte:head>

<form method="POST">
    <input bind:value={username} type="text" class="form-control form-group" name="username" placeholder="Username" autocomplete="off" required>
    <br>
    <input bind:value={password} type="password" class="form-control form-group" name="password" placeholder="Password" autocomplete="off" required>
    <br>
    <input bind:value={confirmPassword} type="password" class="form-control form-group" name="confirmation" placeholder="Confirm Password" autocomplete="off" required>
    <br>
    <button on:click={register} type="submit" class="btn btn-primary">Register</button>
</form>

<p>{errorMsg}</p>
