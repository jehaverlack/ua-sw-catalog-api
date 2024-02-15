const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000; // You can choose any available port

// Your existing function with a slight modification to handle errors
async function fetchAndParse(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const softwareData = [];

        $('.table-responsive').each((_, table) => {
            const category = $(table).find('caption').text().trim();

            $(table).find('tbody tr').each((_, row) => {
                const softwareName = $(row).find('td').eq(0).text().trim();
                const type = $(row).find('td').eq(1).text().trim();
                const platforms = $(row).find('td').eq(2).text().trim();
                const eligibilityText = $(row).find('td').eq(3).text().trim();
                const eligibility = eligibilityText.split(/(?=[A-Z])/);

                softwareData.push({ softwareName, type, platforms, eligibility, category });
            });
        });

        return softwareData;
    } catch (error) {
        console.error('Error fetching/parsing HTML:', error);
        throw error; // Added to handle errors
    }
}

// Express route to handle the API request
app.get('/api/scrape', async (req, res) => {
    try {
        const data = await fetchAndParse('https://service.alaska.edu/TDClient/39/Portal/KB/ArticleDet?ID=1589');
        res.json(data);
    } catch (error) {
        res.status(500).send('Error occurred during data fetching.');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
