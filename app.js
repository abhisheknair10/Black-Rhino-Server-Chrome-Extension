function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }
  
  const path = require('path')
  const express = require('express')
  const app = express()
  const port = process.env.PORT || 3000
  
  app.set("view engine", "ejs");
  
  app.get('/main', (req, res) => {
      var nano = financial(1);
      var usd = financial(nano * 6.7);
      var ret = [nano, usd];
      res.send(nano + "<>" + usd);
      res.end();
  })
  
  //-----------------------------------------------------------------------------
  
  app.listen(port, () => {
      console.log('Server is up on port ' +port)
  })