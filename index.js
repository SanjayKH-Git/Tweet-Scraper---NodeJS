const express = require('express');
const {scrapeLogic} = require("./scrapeLogic");
const {tweetScraper} = require("./tweetScraper");

const app = express();

const PORT = process.env.POSRT || 4000;

app.get("/", (req, res) => {
    res.send("Rendering Tweet Scraper !!");
});

app.get("/scrape", (req, res) => {
       scrapeLogic(res);
    });

app.get("/tweetScrape", (req, res) => {
    tweetScraper(res);
    });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });