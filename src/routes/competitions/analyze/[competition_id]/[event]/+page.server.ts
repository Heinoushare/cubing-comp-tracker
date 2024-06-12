import puppeteer from "puppeteer";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    if (params.event != "333") {
        return;
    } 

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let allRows;

    if (params.event === "333") {
        const url = `https://www.worldcubeassociation.org/competitions/${params.competition_id}/registrations/psych-sheet/${params.event}`;
        await page.goto(url);
        allRows = await page.evaluate(() => {
            const rows = document.querySelectorAll("tr")
            return Array.from(rows).slice(2,9).map((row) => {
                const name = row.querySelector(".name").innerText;
                const wca_id = row.querySelector(".wca-id").innerText;
                const average = row.querySelector(".average").innerText;
                return {name, wca_id, average};
            });
        });
        await browser.close();
    }
    // console.log(allRows);
    return {rows: allRows};
}