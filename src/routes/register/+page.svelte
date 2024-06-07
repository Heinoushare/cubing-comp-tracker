
<script lang="ts">
    import { enhance } from "$app/forms";


    /** @type {import('./$types').PageData} */
    export let form;

    let wca_id = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

</script>

<svelte:head>
  <title>CCT: Register</title>
</svelte:head>

<form method="POST" use:enhance>
    <input bind:value={wca_id} type="text" class="form-control form-group" name="wca_id" placeholder="WCA ID" autocomplete="off" required>
    <br>
    <input bind:value={email} type="email" class="form-control form-group" name="email" placeholder="Email" autocomplete="off" required>
    <br>
    <input bind:value={password} type="password" class="form-control form-group" name="password" placeholder="Password" autocomplete="off" required>
    <br>
    <input bind:value={confirmPassword} type="password" class="form-control form-group" name="confirmationPassword" placeholder="Confirm Password" autocomplete="off" required>
    <br>
    <button type="submit" class="btn btn-primary">Register</button>
</form>

<p class="error"><b>{form?.error || ""}</b></p>
