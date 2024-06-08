<script lang="ts">
    /** @type {import('./$types').PageData} */
	export let data;

    
    let zone = data.zone;

    let latitude = zone["latitude"];
    let longitude = zone["longitude"];
    let radius = zone["radius"];
    let unit = zone["radius_units"];

</script>

<h5>Edit your zone.</h5>
<form method="POST">
    <label>Location</label>
    <input bind:value={latitude} type="number" placeholder="Latitude" name="latitude" step="0.000000000000000001" autocomplete="off" required>
    <input bind:value={longitude} type="number" placeholder="Longitude" name="longitude" step="0.000000000000000001" autocomplete="off" required>
    <br>
    <label>Range</label>
    <input bind:value={radius} type="number" placeholder="Radius" name="radius" autocomplete="off" required>
    <select name="unit" required>
        {#if unit === "miles"}
            <option value="miles" selected>Miles</option>
            <option value="kilometers">Kilometers</option>
        {:else if unit === "kilometers"}
            <option value="miles">Miles</option>
            <option value="kilometers" selected>Kilometers</option>
        {/if}
    </select>
    <br>
    <button type="submit" class="btn btn-primary">Edit</button>
</form>