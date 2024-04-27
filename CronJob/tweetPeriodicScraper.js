const puppeteer = require('puppeteer');
const { Client } = require('pg');
const { mailTrapNodeEmail } = require('./mailTrapNodeEmail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const client = new Client({
    connectionString: 'postgres://sanjay:bhAVfyflB3kzSSgthcdiOMQrgL6sttoL@dpg-cojai3qcn0vc73drqrd0-a.oregon-postgres.render.com/tweetdb_n5bc',
    ssl: {
        rejectUnauthorized: false
    }
});

const tweetScraper = async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
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

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });

        // Wait for tweets to load
        await page.waitForSelector('article', { timeout: 4000 });

        // Scrape tweets
        const tweets = await page.evaluate(() => {
            const articles = document.querySelectorAll('article');
            const tweetData = [];
            articles.forEach((article) => {
                const timeElement = article.querySelector('time');
                const datetime = timeElement.getAttribute('datetime');

                let URL = timeElement.parentElement.getAttribute('href');
                if (URL){
                    URL = "https://twitter.com" + URL;
                }
                // Get all text content from div elements with dir="auto" and append to tweetData
                const tweetTextElements = article.querySelectorAll('div[dir="auto"]');
                const tweetTexts = Array.from(tweetTextElements).map((element) => element.textContent.trim().replace(/\n/g, ''));
                
                let postImage = "";                
                const postImageElement = article.querySelector('img[src*="card_img"]')
                if(postImageElement){
                    postImage = postImageElement.getAttribute('src');
                }
                let hasVideo = article.querySelector('video');            

                tweetData.push({ datetime, URL, tweetTexts, postImage, hasVideo});
                
            });
            return tweetData;
        });

        // Print the tweet datetimes
        console.log('Tweet datetimes:', tweets, '\nNumber of tweets:', tweets.length);

       // Insert scraped data into the database
        await client.connect();
        for (const tweet of tweets) {

            if (tweet.hasVideo){
                mailTrapNodeEmail(tweet.URL);
                console.log("POST HAS MAIL");
            }

            const query = {
                text: 'INSERT INTO tweets(datetime, text, post_image, url) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                values: [tweet.datetime, tweet.tweetTexts ? tweet.tweetTexts.join('\n') : '', tweet.postImage, tweet.URL]
            };
            
            await client.query(query);

            // Save postImage to a directory
            if (tweet.postImage) {
                const imageName = path.basename(tweet.postImage);
                const sanitizedImageName = imageName.replace(/[^\w\s.-]/gi, '') + '.jpg'; // Remove special characters
                console.error('downloading image:', sanitizedImageName);

                const imageFilePath = path.join(__dirname, 'Saved Images', sanitizedImageName);
                try {
                    const response = await axios.get(tweet.postImage, { responseType: 'arraybuffer' });
                    fs.writeFileSync(imageFilePath, response.data);
                    console.log(`Image saved to: ${imageFilePath}`);
                } catch (error) {
                    console.error('Error downloading image:', error);
                }

            }
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