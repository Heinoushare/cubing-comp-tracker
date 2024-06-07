<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";


    onMount(() => {
        invalidateAll();
    });
</script>

<h1>Welcome to Cube Comp Tracker</h1>
<p>A web application to track speedcubing competitions</p>
