const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.set("view engine", "ejs");

app.get('/main', (req, res) => {
    var nano = 1.00;
    var usd = nano * 6.7;
    const ret_arr = [nano.toString(), usd.toString()];
    res.send(ret_arr);
})

//-----------------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up on port ' +port)
})