
<script lang="ts">

    /** @type {import('./$types').PageData} */
	export let data;

    let username = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

    let errorMsg = data.error;

</script>

<svelte:head>
  <title>CCT: Register</title>
</svelte:head>

<form method="POST">
    <input bind:value={username} type="text" class="form-control form-group" name="username" placeholder="Username" autocomplete="off" required>
    <br>
    <input bind:value={email} type="email" class="form-control form-group" name="email" placeholder="Email" autocomplete="off" required>
    <br>
    <input bind:value={password} type="password" class="form-control form-group" name="password" placeholder="Password" autocomplete="off" required>
    <br>
    <input bind:value={confirmPassword} type="password" class="form-control form-group" name="confirmationPassword" placeholder="Confirm Password" autocomplete="off" required>
    <br>
    <button type="submit" class="btn btn-primary">Register</button>
</form>

<p>{errorMsg}</p>
