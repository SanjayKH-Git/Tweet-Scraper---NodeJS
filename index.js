const express = require('express');
const { getLatestData } = require("./getLatestData");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const PORT = process.env.PORT || 4000;

// Configure Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Real Time Tweet Scraper API",
      description: "API for accessing latest scraped tweet data",
      version: "1.0.0"
    },
    servers: [
      { url: `http://localhost:${PORT}` }
    ]
  },
  apis: ["index.js"] // Point to your API entry point (replace with actual file paths if needed)
};

// Generate Swagger document
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at "/api-docs" endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Welcome to Real Time Tweet Scraper !!");
});

app.get("/latest", (req, res) => {
  const pages = req.query.pages; // Get the 'pages' query parameter
  getLatestData(res, pages);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

