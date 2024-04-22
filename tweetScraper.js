const puppeteer = require('puppeteer');
require("dotenv").config();

const tweetScraper = async (res) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
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
            const tweetTexts = Array.from(tweetTextElements).map((element) => element.textContent.trim());

            tweetData.push({ datetime, tweetTexts });
        });
        return tweetData;
    });

        // Print the tweet datetimes
        console.log('Tweet datetimes:', tweets);

        // Send the tweet datetimes as a response
        res.send(tweets);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).send('Error during scraping');
    } finally {
        // Close the browser
        await browser.close();
    }
};

module.exports = { tweetScraper };
