import { parse } from 'node-html-parser';
import fetch from 'node-fetch';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    if (params.event != "333") {
        return;
    } 

    let allRows: { name: string; wca_id: string; average: string; }[] = [];

    if (params.event === "333") {
        const url = `https://www.worldcubeassociation.org/competitions/${params.competition_id}/registrations/psych-sheet/${params.event}`;
        await fetch(url)
        .then(res => res.text())
        .then(body => {
            const root = parse(body);
            const names = root.querySelectorAll('.name');
            const wca_ids = root.querySelectorAll(".wca-id");
            const averages = root.querySelectorAll(".average");
            for (let i = 1; i < names.length; i++) {
                allRows.push({
                    "name": names[i].text, 
                    "wca_id": wca_ids[i].text.trim(),
                    "average": averages[i].text
                })
            }
        });
    }
    // console.log(allRows);
    return {rows: allRows};
}