const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://sanjay:bhAVfyflB3kzSSgthcdiOMQrgL6sttoL@dpg-cojai3qcn0vc73drqrd0-a.oregon-postgres.render.com/tweetdb_n5bc',
    ssl: {
        rejectUnauthorized: false
    }
});

async function getLatestData(res, limit = 5) {
    try {
        console.log(limit);
        const client = await pool.connect();
        const query = `SELECT * FROM tweets ORDER BY datetime DESC LIMIT $1`;
        const result = await client.query(query, [limit]);
        const tweets = result.rows;
        console.log(`Retrieved latest ${limit} tweets:`, tweets);
        res.status(200).json(tweets);
        client.release(); // Release the client back to the pool
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
}

module.exports = { getLatestData };
