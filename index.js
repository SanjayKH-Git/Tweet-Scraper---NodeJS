const express = require('express');
const {getLatestData} = require("./getLatestData");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Rendering Tweet Scraper !!");
});

app.get("/latest", (req, res) => {
    const pages = req.query.pages; // Get the 'pages' query parameter
    getLatestData(res, pages);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });