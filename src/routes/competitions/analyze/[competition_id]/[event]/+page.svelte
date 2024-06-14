<script lang="ts">
    import { page } from '$app/stores';

    /** @type {import('./$types').PageData} */
    export let data;

    let rows = [...data.rows];

    let sort = "mean";

    function sortChange(event: { currentTarget: { id: string; }; }) {
        sort = event.currentTarget.id;
        rows = [...data.rows];
        if (sort === "mean") {
            rows.sort((a, b) => a["mean"] - b["mean"]);
        }
    }



    let event = $page.params.event;

</script>

{#if data?.error}
<h5>{data.error}</h5>
{:else if event == "333"}

    <h4>Sort By:</h4>
    <input on:change={sortChange} name="sort" id="PR" type="radio">
    <label>PR</label><br>
    <input on:change={sortChange} name="sort" id="mean" type="radio">
    <label>Mean</label><br>


    <table>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>WCA ID</th>
            <th>PR Average</th>
            <th>Mean of Averages Since Last PR Average</th>
        </tr>

        {#each rows as row, i}

            <tr>
                <td>{i + 1}</td>
                <td>{row["name"]}</td>
                <td><a href="https://www.worldcubeassociation.org/persons/{row["wca_id"]}" target="_blank">{row["wca_id"]}</a></td>
                <td>{row["average"]}</td>
                <td>{row["mean"]}</td>
            </tr>

        {/each}

    </table>
{:else}
<h5>Apologies, analysis for this event is not supported at the time. Check back soon!</h5>
{/if}