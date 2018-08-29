let express = require("express");
let XLSX = require('xlsx');
let google = require('google/lib/google');
const morgan = require('morgan');
const cors = require('cors');
const {searchTerm} = require('./model');
const {Builder, By, Key, until} = require('selenium-webdriver');

const app = express();

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
      skip: (req, res) => process.env.NODE_ENV === 'test'
    })
  );
  
  app.use(
    cors({
      origin: CLIENT_ORIGIN
    })
  );

var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors');
cheerio = cheerioAdv.wrap(cheerio);
const request = require('request');
const fs = require('fs');
//const writeStream = fs.createWriteStream('post.csv');

// start by overwriting an existing file if it exists, post.csv

fs.writeFileSync('post.csv', `Title, Link, Date\n`, 'utf8');

//write headers
//writeStream.write(`Title, Link, Date \n`);

app.get('/cheerioSearch', (req, res) => {
    request('http://codedemos.com/sampleblog', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        
        $('.post-preview').each((i, el) => {
            const title = $(el)
                .find('.post-title')
                .text()
                .replace(/\s\s+/g, ''); // to get rid of whitespace, g is global

            const link = $(el)
                .find('a')
                .attr('href');

            const date = $(el)
                .find('.post-date')
                .text()
                .replace(/,/, ''); // get rid of comma before year

            //console.log(title, link, date)

            //write row to csv
           //return writeStream.write(`${title}, ${link}, ${date} \n`);
            
           return fs.appendFile('post.csv', `${title}, ${link}, ${date} \n`, 'utf8', (err) => {
               if (err) throw 'error';
               return res.status(200).send()
           }  )
        })
        console.log('Done scrapping')
    }
});
})

app.get('/search/:searchTerm', (req, response) => {

    let wb = XLSX.readFile('Test.xlsx');
    let existingSearchTerm = 'pomsky' // later should get saved in server side

    function append_sheet(data) {

        if (wb.Sheets[req.params.searchTerm]) {
            const existingSheet = wb.Sheets[req.params.searchTerm];
            XLSX.utils.sheet_add_json(existingSheet, data, {skipHeader: true, origin: -1}) //append new data to the end of existing sheet
        } else {
            var ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, req.params.searchTerm);
        }

        
       // if searchTerm doesnt exist call this line, else append to existing sheet
        // if (req.params.searchTerm !== existingSearchTerm) {
        //     XLSX.utils.book_append_sheet(wb, ws, req.params.searchTerm); // new tab
        // }
        // else {
        //     XLSX.utils.
        //     XLSX.utils.sheet_add_json(, data existingSearchTerm); // existing tab
        // }
        
        
        console.log(req.params.searchTerm);
        console.log("append");
        return wb;
    }

    google.resultsPerPage = 10
    var nextCounter = 0

    let searchResults = [];

    google(req.params.searchTerm, function (err, res){
        console.log('waiting for resusts');
        if (err) console.error(err)

        for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            searchResults.push(link);
        }

        if (nextCounter < 4) {
            nextCounter += 1
            if (res.next) res.next()
            else {
                response.json(searchResults)
            }
        }
        else {
            console.log("should start workbook");
            const append_sheet_var = append_sheet(searchResults);
            console.log("workbook here");

            //response.set('Content-Type', 'application/octet-stream');
           // response.set('Content-Disposition', "attachment; filename=" + req.params.searchTerm + '.xlsx')

            response.send(XLSX.writeFile(append_sheet_var, 'Test.xlsx', {type:'buffer', bookType:'xlsx'}));
        }
    })
})

app.get('/allData/:sheetName', function(req, res) {
    const json = XLSX.utils.sheet_to_json(wb.Sheets[req.params.sheetName]);
    res.json(json)
})

async function extractMetadata(googleSearchResult, pageHtml) {
    const $ = cheerio.load(pageHtml);
    
    const objToReturn = {
        link: googleSearchResult.link,
        //title: item.snippet.title
    };

    const url =  new URL(googleSearchResult.link);
    const hostname = url.hostname.toLowerCase();
    console.log('hostname', hostname)

    if (hostname.endsWith("youtube.com")) {
        return await ExtractYouTube(googleSearchResult, $, objToReturn);
    } else {
        return ExtractDefault(googleSearchResult, $, objToReturn);
    }


    
}

async function ExtractYouTube(googleSearchResult, $, existingItem = {}) {

    let driver = await new Builder().forBrowser('chrome').build();
    let title;
    try {
      await driver.get(googleSearchResult.link);
      const titleEl = await driver.findElement(By.css('yt-formatted-string#title'));
      title = await titleEl.getText();
      console.log('title El', titleEl)
      console.log('title', title)
    } finally {
      await driver.quit();
    }
    
    return {
        ...existingItem, title
    };
}

function ExtractDefault(googleSearchResult, $, existingItem = {}) {
    //title
    $('article, header, body, h1').each((i, el) => {
        const title = $(el)
            .find('h1 > .ytd-video-primary-info-renderer, h1, h2, a' ) 
            .text()
        if (title && !existingItem.title) {
            existingItem.title = title;
        }
        
    })

    //date
    $('article, header').each((i, el) => {

        const date = $(el)
            .find('time, .asset-metabar-time-updated,  .article-publish-date')
            .text()
            .replace(/,/, ''); // get rid of comma before year
        if (date && !existingItem.date) {
            existingItem.date = date
            }
    })

    return existingItem;
}

const fetch = require('node-fetch');
app.get('/finalResult/:searchTerm', function(req, res) {
    //get search term from request
    const searchTerm = req.params.searchTerm;
    const url =        `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&cx=002391576498916891741%3Avnikl71zia0&num=10&key=AIzaSyDWLuyXDJnXJ7wxA5PJPxxh70MdXLt2A5A&dateRestrict=w1`;

    
    //use Google search API
    fetch(url)
        .then(response => response.json())
        .then(searchResults => {
            console.log(searchResults);            
            //extract links
            const promises = searchResults.items.map(item => 
                fetch(item.link)
                .then(res => res.text())
                //.then(text => ({ item, text }))
                .then(text => extractMetadata(item, text))
            );
            //wait for them to all finish
            Promise.all(promises)
                .then((arrayToReturn) => res.json(arrayToReturn));

        })
})


app.get('/youtube/:searchTerm', function(req, res) {

    const searchTerm = req.params.searchTerm; 
    const urls = [

    ]

       
    return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchTerm}&type=title&key=AIzaSyDWLuyXDJnXJ7wxA5PJPxxh70MdXLt2A5A&dateRestrict=w1`)
    .then (res => res.json())
    .then (result => console.log(result.items)) 
    .then (snippet =>console.log(snippet.snippet))
})


function runServer(port = PORT) {
    const server = app
      .listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
      })
      .on('error', err => {
        console.error('Express failed to start');
        console.error(err);
      });
  }

  if (require.main === module) {
    runServer();
  }
  
  module.exports = { app };