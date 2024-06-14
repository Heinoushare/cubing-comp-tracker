import { parse } from 'node-html-parser';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    if (params.event != "333") {
        return;
    } 

    let allRows: { name: string; wca_id: string; average: string; }[] = [];

    // let analysisLimit = names.length;
    let analysisLimit = 10;

    if (params.event === "333") {
        const url = `https://www.worldcubeassociation.org/competitions/${params.competition_id}/registrations/psych-sheet/${params.event}`;
        await fetch(url)
        .then(res => res.text())
        .then(body => {
            const root = parse(body);
            const names = root.querySelectorAll('.name');
            const wca_ids = root.querySelectorAll(".wca-id");
            const averages = root.querySelectorAll(".average");

            for (let i = 1; i <= analysisLimit; i++) {
                allRows.push({
                    "name": names[i].text, 
                    "wca_id": wca_ids[2 * i].text.trim(),
                    "average": averages[i].text
                })
            }
        });
    }

    for (let row of allRows) {
        try {
            const response = await fetch("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/" + row["wca_id"] + ".json", {
                method: 'GET', // Set the method to GET
                headers: {
                    'Content-Type': 'application/json' // Set the headers appropriately
                }
            });

            let person = await response.json();


            let PRavg;
            for (let average of person["rank"]["averages"]) {
                if (average["eventId"] === params.event) {
                    PRavg = average["best"];
                }
            }

            let relevantResults = [];
            let mean = 0;
            for (let [key, value] of Object.entries(person["results"])) {
                let b = false;
                if (value[params.event]) {
                    for (let round of value[params.event]) {
                        
                        let avg = parseInt(round["average"])
                        if (!isNaN(avg)) {
                            avg /= 100
                            mean += avg
                            relevantResults.push(avg);
                        }
                        if (round["average"] === PRavg) {
                            b = true;
                            break;
                        }
                    }
                    if (b) {
                        break;
                    }
                }
            }
            mean /= relevantResults.length
            mean = Math.round(mean * 100) / 100
            row["mean"] = mean

            // console.log(mean);

            if (!response.ok) {
                return {error: "Invalid WCA ID"};
            }
        } catch (e) {
            console.log(e);
        }
    }

    // console.log(allRows);
    return {rows: allRows};
}