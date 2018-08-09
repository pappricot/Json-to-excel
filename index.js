let express = require("express");
let XLSX = require('xlsx');
let google = require('google');

const app = express();

function make_book(data) {
    console.log("start make-book");
    var ws = XLSX.utils.json_to_sheet(data);
    console.log("ws");
    // load book from existing file
    var wb = XLSX.utils.book_new();
    console.log("wb");
    //if searchTerm doesnt exist call this line, else append to existing sheet
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    console.log("append");
	return wb;
}

app.get('/:searchTerm', (req, response) => {
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
            const workbook = make_book(searchResults);
            console.log("workbook here");

            response.set('Content-Type', 'application/octet-stream');
            response.set('Content-Disposition', "attachment; filename=" + req.params.searchTerm + '.xlsx')

            response.send(XLSX.write(workbook, {type:'buffer', bookType:'xlsx'}));
        }
    })
})

let PORT = 8081;

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