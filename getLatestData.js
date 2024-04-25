const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://sanjay:bhAVfyflB3kzSSgthcdiOMQrgL6sttoL@dpg-cojai3qcn0vc73drqrd0-a.oregon-postgres.render.com/tweetdb_n5bc',
    ssl: {
        rejectUnauthorized: false
    }
});

const getLatestData = async (res) => {
    try {
        await client.connect();

        const query = 'SELECT * FROM tweets';
        const result = await client.query(query);

        const tweets = result.rows;
        console.log('Retrieved tweets:', tweets);

        res.status(200).json(tweets);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    } finally {
        await client.end();
    }
};

module.exports = { getLatestData };
