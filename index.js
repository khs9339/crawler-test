
const express = require('express')
const fs = require('fs-extra')
const app = express()

const Crawler = require("crawler");

app.get('/', (req, res) => {
  res.send('Hello Crawler Test')
})

app.get('/wmp', (req, res) => {
  res.sendFile(`${__dirname}/target.html`)
})

app.get('/target/:type', (req, res) => {
  const { type = 'target' } = req.params;
  fs.writeJSONSync('./header.json', req.headers)
  switch (type) {
    case 'load':
      res.sendFile(`${__dirname}/onload.html`)
      break;
    default:
      res.sendFile(`${__dirname}/target.html`)
      break
  }
})

app.get('/crawler', (req, res) => {
  const { type = 'wmp' } = req.query;
  const target = 'http://localhost:3000/target/' || 'https://mock-app.herokuapp.com/target/';
  const c = new Crawler({
    maxConnections: 10,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
      "Cookies": "test=1",
    }
  });
  c.queue([{
    uri: target.concat(type),
    jQuery: true,
    referer: 'https://front.wemakeprice.com/main',
    // The global callback won't be called
    callback: function (error, data, done) {
      if (error) {
          console.log(error)
          res.send('error')
      } else {
          const $ = data.$;
          fs.writeFileSync('./output.txt', data.body)
          const priceDom = $('.price .sale_box .sale_price .num');
          res.send(`가격정보: ${priceDom.text()}`)
        }
        done();
    }
  }]);

})

// module.exports = router = app
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});