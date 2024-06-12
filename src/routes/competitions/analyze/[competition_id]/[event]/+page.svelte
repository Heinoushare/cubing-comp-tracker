<script lang="ts">
    import { page } from '$app/stores';

    /** @type {import('./$types').PageData} */
    export let data;

    let rows = data.rows;

    let event = $page.params.event;

</script>

{#if data?.error}
<h5>{data.error}</h5>
{:else if event == "333"}
    <table>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>WCA ID</th>
            <th>PR Average</th>
        </tr>

        {#each rows as row, i}

            <tr>
                <td>{i + 1}</td>
                <td>{row["name"]}</td>
                <td><a href="https://www.worldcubeassociation.org/persons/{row["wca_id"]}">{row["wca_id"]}</a></td>
                <td>{row["average"]}</td>
            </tr>

        {/each}

    </table>
{:else}
<h5>Apologies, analysis for this event is not supported at the time. Check back soon!</h5>
{/if}