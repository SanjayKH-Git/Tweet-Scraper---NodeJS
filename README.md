# Tweet-Scraper---NodeJS
Node JS based Tweet Scraper (Puppeter)
### caution: Experimental Project!!

- Periodically scrapes Data from the page https://twitter.com/coindesk for every Hour
- NodeJS Puppeter based scraper deployed on GitHub Actions for cron Job
- Email Alert if Video found on the Twitter Post
- Store the Post Images on Local/Cloud storage
- Save the Data in PostgreSQL free instance from Render.com
- NodeJS Express Server hosted on Remder.com free tier
- The GET API provides Latest data based on Pages


**Architecture:**

<img width="825" alt="Architecture" src="https://github.com/SanjayKH-Git/Tweet-Scraper---NodeJS/assets/56336350/7b33c12f-2221-4941-9edf-74a99167b344">


Git Actions(cron Job):  
[https://github.com/SanjayKH-Git/Tweet-Scraper---NodeJS/actions/workflows/scrape.yml](https://github.com/SanjayKH-Git/Tweet-Scraper---NodeJS/actions/workflows/scrape.yml)

Host: https://tweet-scraper-api.onrender.com/

GET API: https://tweet-scraper-api.onrender.com/latest?pages=5

**Email Notification for Video:**

<img width="825" alt="Email" src="https://github.com/SanjayKH-Git/Tweet-Scraper---NodeJS/assets/56336350/91d82000-bbdd-4330-a6ed-3b29c815ae03">
