<script lang="ts">

    /** @type {import('./$types').PageData} */
	export let data;

    let competitions = data.competitions;

    let zone = data.zone;

    let latitude = zone["latitude"];
    let longitude = zone["longitude"];
    let radius = zone["radius"];
    let unit = zone["radius_units"];

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

    let editZone = false;
    function edit() {
        editZone = true;
    }

</script>


<h5>Upcoming Competitions in your zone:</h5>
<br>
<table>
    <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Venue</th>
        <th>events</th>
    </tr>

    {#each competitions as comp, i}

        <tr>
            <td>{comp["name"]}</td>
            <td>From {comp["date_from"]} till {comp["date_till"]}</td>
            <td>{comp["venue_address"]}</td>
            <td>{comp["events"]}</td>
        </tr>

    {/each}

</table>

<br>
{#if !editZone}
    <button on:click={edit} class="btn btn-primary">Edit Zone</button>
{:else if editZone}
    <h5>Edit your zone.</h5>
    <form method="POST">
        <label>Location</label>
        <input bind:value={latitude} class="form-control form-group" type="number" placeholder="Latitude" name="latitude" step="0.000000000000000001" autocomplete="off" required>
        <input bind:value={longitude} class="form-control form-group" type="number" placeholder="Longitude" name="longitude" step="0.000000000000000001" autocomplete="off" required>
        <button type="button" class="btn btn-warning" on:click={useCurrentLocation}>{locationButtonText}</button>
        <br>
        <label>Range</label>
        <input bind:value={radius} class="form-control form-group" type="number" placeholder="Radius" name="radius" autocomplete="off" required>
        <select class="form-control form-group" name="unit" required>
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
{/if}