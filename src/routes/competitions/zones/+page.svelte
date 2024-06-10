<script lang="ts">
    /** @type {import('./$types').PageData} */
	export let data;
    $: zones = data.zones;

    let latitude: number;
    let longitude: number;
    let locationButtonText = "Use Current Location";
    function useCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showLocation);
        } else { 
            locationButtonText = "Geolocation is not supported by this browser.";
        }
    }

    function showLocation(position: { coords: { latitude: number; longitude: number; }; }) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude
    }

    let newZone = false;
    function makeNewZone() {
        newZone = true;
    }
</script>

{#each zones as zone, i}
    <div class="card bg-success">
        <div class="card-body">
            <h4 class="card-title">{zone["name"]}</h4>
            <p class="card-text">Latitude: {zone["latitude"]} Longitude: {zone["longitude"]}</p>
            <p class="card-text">Radius: {zone["radius"]} {zone["radius_units"]}</p>
            <a href="/competitions/zones/{zone["zone_id"]}" class="btn btn-primary">View/Edit</a>
            <form method="POST" action="?/delete">
                <button name="zone_id" value="{zone["zone_id"]}" type="submit" class="btn btn-danger">Delete</button>
            </form>
        </div>
    </div>
    <br>
{/each}

<button on:click={makeNewZone} class="btn btn-primary">Create New Zone</button>

{#if newZone}
    <br>
    <br>
    <h5>Make a circle of the area that you would like to get notifications about competitions for.</h5>
    <form method="POST" action="?/create">
        <label>Zone Name</label>
        <input class="form-control form-group" type="text" name="name" placeholder="Zone Name" autocomplete="off" required>
        <br>
        <label>Location</label>
        <input bind:value={latitude} class="form-control form-group" type="number" placeholder="Latitude" name="latitude" step="0.000000000000000001" autocomplete="off" required>
        <input bind:value={longitude} class="form-control form-group" type="number" placeholder="Longitude" name="longitude" step="0.000000000000000001" autocomplete="off" required>
        <button type="button" class="btn btn-warning" on:click={useCurrentLocation}>{locationButtonText}</button>
        <br>
        <label>Range</label>
        <input type="number" class="form-control form-group" placeholder="Radius" name="radius" autocomplete="off" required>
        <select class="form-control form-group" name="unit" required>
            <option value="miles">Miles</option>
            <option value="kilometers">Kilometers</option>
        </select>
        <br>
        <button type="submit" class="btn btn-primary">Create</button>
    </form>
{/if}