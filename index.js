
const express = require('express')
const fs = require('fs-extra')
const app = express()
const port = 3000

const Crawler = require("crawler");

app.get('/', (req, res) => {
  res.send('Hello Crawler Test')
})


app.get('/wmp', (req, res) => {
  res.sendFile(`${__dirname}/target.html`)
})

app.get('/crawler', (req, res) => {

  const c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
  });
  c.queue([{
    uri: 'http://localhost:3000/wmp',
    jQuery: true,
 
    // The global callback won't be called
    callback: function (error, data, done) {
      if (error) {
          console.log(error)
          res.send('error')
      } else {
          const $ = data.$;
          console.log('Grabbed', data.body.length, 'bytes');
          fs.writeFileSync('./output.txt', data.body)
        const priceDom = $('.price .sale_box .sale_price .num');
        console.log(priceDom)
          res.send(priceDom.text())
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