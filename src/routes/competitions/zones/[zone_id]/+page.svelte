<script lang="ts">

    /** @type {import('./$types').PageData} */
	export let data;

    let competitions = data.competitions;

    let zone = data.zone;

    let zoneName = zone["name"];
    let latitude = zone["latitude"];
    let longitude = zone["longitude"];
    let radius = zone["radius"];
    let unit = zone["radius_units"];

    let locationButtonText = "Use Current Location";
    function useCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showLocation);
            locationButtonText = "Location...";
        } else { 
            locationButtonText = "Geolocation is not supported by this browser.";
        }
    }

    function showLocation(position: { coords: { latitude: number; longitude: number; }; }) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude
        locationButtonText = "Done";
    }

    let editZone = false;
    function edit() {
        editZone = true;
    }


    let events = {
        "333": false,
        "222": false,
        "444": false,
        "555": false,
        "666": false,
        "777": false,
        "333bf": false,
        "333fm": false,
        "333oh": false,
        "clock": false,
        "minx": false,
        "pyram": false,
        "skewb": false,
        "sq1": false,
        "444bf": false,
        "555bf": false,
        "333mbf": false
    }
    $: {
        if (events["333"] || events["222"] || events["444"] || events["555"] || events["666"] || events["777"] || 
            events["333bf"] || events["333fm"] || events["333oh"] || 
            events["clock"] || events["minx"] || events["pyram"] || events["skewb"] || events["sq1"] || 
            events["444bf"] || events["555bf"] || events["333mbf"]) {

            competitions = [];
            for (let comp of data.competitions) {
                for (let [key, value] of Object.entries(events)) {
                    if (value) {
                        if (comp["events"].lastIndexOf(key) != -1) {
                            competitions.push(comp);
                        }
                    }
                }
            }
        }
        else {
            competitions = data.competitions;
        }
    }
</script>


<h5>Upcoming Competitions in {zone["name"]} zone:</h5>
<br>
<h6>Filter by events:</h6>
<div class="events-checkbox-flexbox">
    <div class="events-checkbox-flex">
        <label>3x3x3</label>
        <input bind:checked={events["333"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>2x2x2</label>
        <input bind:checked={events["222"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>4x4x4</label>
        <input bind:checked={events["444"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>5x5x5</label>
        <input bind:checked={events["555"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>6x6x6</label>
        <input bind:checked={events["666"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>7x7x7</label>
        <input bind:checked={events["777"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>3BLD</label>
        <input bind:checked={events["333bf"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>FMC</label>
        <input bind:checked={events["333fm"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>OH</label>
        <input bind:checked={events["333oh"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>Clock</label>
        <input bind:checked={events["clock"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>Mega</label>
        <input bind:checked={events["minx"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>Pyra</label>
        <input bind:checked={events["pyram"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>Skewb</label>
        <input bind:checked={events["skewb"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>SQ1</label>
        <input bind:checked={events["sq1"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>4BLD</label>
        <input bind:checked={events["444bf"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>5BLD</label>
        <input bind:checked={events["555bf"]} type="checkbox">
    </div>
    <div class="events-checkbox-flex">
        <label>MBLD</label>
        <input bind:checked={events["333mbf"]} type="checkbox">
    </div>
</div>

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
            {#if comp["date_from"] == comp["date_till"]}
                <td>{comp["date_from"]}</td>
            {:else}
                <td>From {comp["date_from"]} till {comp["date_till"]}</td>
            {/if}
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
        <label>Zone Name</label>
        <input bind:value={zoneName} class="form-control form-group" type="text" name="name" placeholder="Zone Name" autocomplete="off" required>
        <br>
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

<br>
<br>
<br>
<br>
<br>