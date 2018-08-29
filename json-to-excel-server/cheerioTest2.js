const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv');

//write headers
writeStream.write(`Title, Link, Date \n`);

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
            writeStream.write(`${title}, ${link}, ${date} \n`);
            
        })
        console.log('Done')
    }
});

