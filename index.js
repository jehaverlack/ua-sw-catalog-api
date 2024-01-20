const axios = require('axios');
const cheerio = require('cheerio');

async function fetchAndParse(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const softwareData = [];

        // Iterate over each table
        $('.table-responsive').each((_, table) => {
            const category = $(table).find('caption').text().trim();

            // Iterate over each table row
            $(table).find('tbody tr').each((_, row) => {
                const softwareName = $(row).find('td').eq(0).text().trim();
                const type = $(row).find('td').eq(1).text().trim();
                const platforms = $(row).find('td').eq(2).text().trim();
                const eligibilityText = $(row).find('td').eq(3).text().trim();
                const eligibility = eligibilityText.split(/(?=[A-Z])/); // Splits based on capital letters

                softwareData.push({ softwareName, type, platforms, eligibility, category });
            });
        });

        return softwareData;
    } catch (error) {
        console.error('Error fetching/parsing HTML:', error);
    }
}

fetchAndParse('https://service.alaska.edu/TDClient/39/Portal/KB/ArticleDet?ID=1589')
    .then(data => console.log(JSON.stringify(data, null, 2)));
