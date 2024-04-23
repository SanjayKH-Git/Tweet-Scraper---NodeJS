const puppeteer = require('puppeteer');
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://sanjay:bhAVfyflB3kzSSgthcdiOMQrgL6sttoL@dpg-cojai3qcn0vc73drqrd0-a.oregon-postgres.render.com/tweetdb_n5bc',
    ssl: {
        rejectUnauthorized: false
    }
});

const tweetScraper = async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });

    try {
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto('https://twitter.com/coindesk');

        await new Promise(r => setTimeout(r, 1000));

        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });

        // Wait for tweets to load
        await page.waitForSelector('article');

        // Scrape tweets
        const tweets = await page.evaluate(() => {
            const articles = document.querySelectorAll('article');
            const tweetData = [];
            articles.forEach((article) => {
                const timeElement = article.querySelector('time');
                const datetime = timeElement.getAttribute('datetime');

                // Get all text content from div elements with dir="auto" and append to tweetData
                const tweetTextElements = article.querySelectorAll('div[dir="auto"]');
                // const tweetTexts = Array.from(tweetTextElements).map((element) => element.textContent.trim());
                const tweetTexts = Array.from(tweetTextElements).map((element) => element.textContent.trim().replace(/\n/g, ''));
                tweetData.push({ datetime, tweetTexts });
            });
            return tweetData;
        });

        // Print the tweet datetimes
        console.log('Tweet datetimes:', tweets);

       // Insert scraped data into the database
        await client.connect();
        for (const tweet of tweets) {
            const query = {
                text: 'INSERT INTO tweets(datetime, text) VALUES($1, $2) ON CONFLICT DO NOTHING',
                values: [tweet.datetime, tweet.tweetTexts ? tweet.tweetTexts.join('\n') : '']
            };
            
            await client.query(query);
        }
        console.log('Data inserted successfully');

        // Close the database connection
        await client.end();

        // Close the browser
        await browser.close();

        return tweets;
    } catch (error) {
        console.error('Error during scraping:', error);
        await client.end();
        return null;
    } finally {
        // Close the browser
        await browser.close();
    }
};

// Uncomment this line if you want to test the scraper independently
tweetScraper().then(tweets => console.log(tweets));

module.exports = { tweetScraper };
