<script lang="ts">
    import { enhance } from "$app/forms";
  import { goto, invalidateAll } from "$app/navigation";
    export let form;

    let wca_idOrEmail = "";
    let password = "";

</script>
<svelte:head>
  <title>CCT: Login</title>
</svelte:head>

<form method="POST" use:enhance>
    <input bind:value={wca_idOrEmail} type="text" class="form-control form-group" name="wca_idOrEmail" placeholder="WCA ID/Email" autocomplete="off" required>
    <br>
    <input bind:value={password} type="password" class="form-control form-group" name="password" placeholder="Password" autocomplete="off" required>
    <br>
    <button type="submit" class="btn btn-primary">Login</button>
</form>

<p class="error"><b>{form?.error || ""}</b></p>