const express = require('express');
const {getLatestData} = require("./getLatestData");
const {tweetScraper} = require("./tweetScraper");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Rendering Tweet Scraper !!");
});

app.get("/latest", (req, res) => {
       getLatestData(res);
    });

app.get("/tweetScrape", (req, res) => {
    tweetScraper(res);
    });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });