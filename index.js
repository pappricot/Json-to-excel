let express = require("express");
let XLSX = require('xlsx');
let google = require('google/lib/google');
const morgan = require('morgan');
const cors = require('cors');
const {SearchResults} = require('./model');
const {Builder, By, Key, until} = require('selenium-webdriver');

const app = express();

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
      skip: (req, res) => process.env.NODE_ENV === 'test'
    })
  );
  


const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
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

app.get('/searchExport/:id', (req, response) => {
    const id = req.params.id
    let wb = XLSX.readFile('Test.xlsx');

    function append_sheet(data, searchTerm) {
        console.log('data', data[0]);
        if (wb.Sheets[searchTerm]) {
            const existingSheet = wb.Sheets[searchTerm];
            XLSX.utils.sheet_add_json(existingSheet, data, {skipHeader: true, origin: -1}) //append new data to the end of existing sheet
        } else {
            var ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, searchTerm);
        }

        
       // if searchTerm doesnt exist call this line, else append to existing sheet
        // if (req.params.searchTerm !== existingSearchTerm) {
        //     XLSX.utils.book_append_sheet(wb, ws, req.params.searchTerm); // new tab
        // }
        // else {
        //     XLSX.utils.
        //     XLSX.utils.sheet_add_json(, data existingSearchTerm); // existing tab
        // }
        
        return wb;
    }

    SearchResults
        .findById(id)
        .exec()
        .then((searchResult) => {
           const searchResults = JSON.parse(JSON.stringify(searchResult.results));
           const append_sheet_var = append_sheet(searchResults, searchResult.searchTerm);
           //console.log('searchResult', searchResult)
            
            //response.set('Content-Type', 'application/octet-stream');
            // response.set('Content-Disposition', "attachment; filename=" + req.params.searchTerm + '.xlsx')

            response.send(XLSX.writeFile(append_sheet_var, 'Test.xlsx', {type:'buffer', bookType:'xlsx'}));
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
        try {
            return await ExtractSelenium(googleSearchResult, $, objToReturn, 'yt-formatted-string#title, h1.title > yt-formatted-string', 'div.style-scope.ytd-video-secondary-info-renderer');
        } catch(e) {
            return ExtractDefault(googleSearchResult, $, objToReturn);
        }
    }
    else if (hostname.endsWith("facebook.com")) {
        try {
            return await ExtractSelenium(googleSearchResult, $, objToReturn, '#js_1.timestampContent');
        } catch(e) {
            return ExtractDefault(googleSearchResult, $, objToReturn);
        }
    }
    else {
        return ExtractDefault(googleSearchResult, $, objToReturn);
    }


    
}
const wait = ms => new Promise(res => setTimeout(res, ms))
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
// await ExctractSelenium({titleSelector, summarySelector})

async function ExtractSelenium(googleSearchResult, $, existingItem = {}, titleSelector, summarySelector) {

    const isHeadless = true;

    const args = [];

    if (isHeadless) {
        args.push('--headless');
    }

    //preventing Chrome pop-up
    const chromeCapabilities = webdriver.Capabilities.chrome();
    chromeCapabilities.set('chromeOptions', {args});
    
    const getChromeOptions = () => {
        if (process.env.GOOGLE_CHROME_SHIM) {
            return new chrome.Options().setChromeBinaryPath(process.env.GOOGLE_CHROME_SHIM).headless();
        }

        return new chrome.Options().headless();
    }

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(getChromeOptions())
        .withCapabilities(chromeCapabilities)
        .build();
    let title;
    let summary;

    async function findElementByCssOrTimeout(selector, timeout, interval = 500) {

        await wait(interval);
        // endpoint for the function to give up
        if (timeout < 0) {
            return null;
        }

        try {
            return driver.findElement(By.css(selector))
        }
        catch(e) {
            // use recursion
            return findElementByCssOrTimeout(selector, timeout - interval, interval)
        }
    }

    try {
      await driver.get(googleSearchResult.link);
      await wait(1000);
      //const titleEl = await findElementByCssOrTimeout('yt-formatted-string#title, h1.title > yt-formatted-string', 7000, 500);
      const titleEl = await findElementByCssOrTimeout(titleSelector, 7000,500)
      title = await titleEl.getText();
      //const summaryEl = await findElementByCssOrTimeout('div.style-scope.ytd-video-secondary-info-renderer', 7000, 500);
      const summaryEl = await findElementByCssOrTimeout(summarySelector, 7000, 500);
      summary = await summaryEl.getText();
      console.log('summary El', summaryEl)
      console.log('summary', summary)
    //   console.log('title El', titleEl)
    //   console.log('title', title)
    } catch (e) {
        console.error(e)
        return {
            ...existingItem,
        };
    } finally {
      await driver.quit();
    }
    
    return {
        ...existingItem, title, summary
    };
}

function ExtractDefault(googleSearchResult, $, existingItem = {}) {
    //title
    $('article, header, body, h1').each((i, el) => {
        const title = $(el)
            .find('h1 > .ytd-video-primary-info-renderer, h1, h2, a, span' ) 
            .text()
        if (title && !existingItem.title) {
            existingItem.title = title;
        }
        
    })

    //date
    $('article, header, span, abbr').each((i, el) => {

        const date = $(el)
            .find('time, .asset-metabar-time-updated,  .article-publish-date, #js_1.timestampContent, title ')
            .text()
            .replace(/,/, ''); // get rid of comma before year
        if (date && !existingItem.date) {
            existingItem.date = date
            }
    })

    //summary
    $('article, header, div, p').each((i, el) => {

        const summary = $(el)
            .find('.content__standfirst, .body-el-text.standard-body-el-text, p:first-of-type')
            .text()
            .replace(/,/, ''); // get rid of comma before year
        if (summary && !existingItem.summary) {
            existingItem.summary = summary
            }
    })

    return existingItem;
}

async function getSearchResultsForUrl(url, searchTerm) {
    const fetchR = await fetch(url)
    console.log('fetchR', fetchR)
    const fetchResult = await fetchR.json()
    console.log('fetchResult', fetchResult)
    const promises = fetchResult.items.map(async item => {
       const fetchAnotherResult = await fetch(item.link)
       const textVersionofFetch = await fetchAnotherResult.text()
        //.then(text => ({ item, text }))
        return extractMetadata(item, textVersionofFetch)
    });
    const arrResults = await Promise.all(promises)
    console.log('arrResults', arrResults.length)
    const searchResults = new SearchResults({
        results: arrResults, 
        searchTerm
    }) 
    const searchResultsSaved = await searchResults.save()
    console.log('searchResultsSaved', searchResultsSaved.length)
    return searchResultsSaved
}

const fetch = require('node-fetch');
app.get('/finalResult/:searchTerm', function(req, res) {
    //get search term from request
    const searchTerm = req.params.searchTerm;
    const url = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&cx=002391576498916891741%3Avnikl71zia0&num=10&key=AIzaSyDWLuyXDJnXJ7wxA5PJPxxh70MdXLt2A5A&dateRestrict=w1`;

    
    getSearchResultsForUrl(url, searchTerm).then((searchResults) => res.json(searchResults))
    .catch(e => res.status(500).json(e));

    //use Google search API
    // fetch(url)
    //     .then(response => response.json())
    //     .then(searchResults => {
    //         console.log(searchResults);            
    //         //extract links
    //         const promises = searchResults.items.map(item => 
    //             fetch(item.link)
    //             .then(res => res.text())
    //             //.then(text => ({ item, text }))
    //             .then(text => extractMetadata(item, text))
    //         );
    //         //wait for them to all finish
    //         Promise.all(promises)
    //             .then((arrayToReturn) => res.json(arrayToReturn));

    //     })
})


function runServer(port = PORT) {
    dbConnect().then(() => {
        const server = app
        .listen(port, () => {
          console.info(`App listening on port ${server.address().port}`);
        })
        .on('error', err => {
          console.error('Express failed to start');
          console.error(err);
        });
    })
  }

  if (require.main === module) {
    runServer();
  }
  
  module.exports = { app };