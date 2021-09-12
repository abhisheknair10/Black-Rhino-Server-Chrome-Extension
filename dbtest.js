const express = require('express')
const app = express()

const { Client } = require('pg')

const client = new Client({
    user: 'doadmin',
    host: 'rhino-cluster-do-user-9771361-0.b.db.ondigitalocean.com',
    database: 'defaultdb',
    password: 'oSJvEX4hWDu82WyU',
    port: 25060,
    ssl: true
})

app.get('/database', async (req, res) => {
    const { rows } = await client.query("INSERT INTO mainuserdata VALUES ('user1234567890', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 0, NULL)");
    res.json(rows)
});

//-----------------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up on port ' +port)
})