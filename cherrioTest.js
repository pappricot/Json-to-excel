const request = require('request');
const cheerio = require('cheerio');

request('http://codedemos.com/sampleblog', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html); //to make it look JQuery like

        const siteHeading = $('.site-heading');
        //console.log(siteHeading.html()) // gets with element tags
        //console.log(siteHeading.text()) // only the text

        // const output = siteHeading.find('h1').text();
        // const output2 = siteHeading.children('h1').text();
        // const output3 = siteHeading
        //     .children('h1')
        //     .next()
        //     .text()
        // const output4 = siteHeading
        //     .parent('h1')
        //     .next()
        //     .text()

        // console.log(output);
        // console.log(output2);
        // console.log(output3);
        // console.log(output4);

        $('.nav-item a').each((i, el) => {
            const item = $(el).text();
            const link = $(el).attr('href');
            console.log(link)
        })
    }
});