let express = require("express");
let XLSX = require('xlsx');
let google = require('google');

const app = express();

function make_book() {
    let wb = XLSX.utils.book_new();
    return wb;
}

let wb = make_book();

app.get('/:searchTerm', (req, response) => {

    function append_sheet(data) {
        var ws = XLSX.utils.json_to_sheet(data);
        //if searchTerm doesnt exist call this line, else append to existing sheet
        XLSX.utils.book_append_sheet(wb, ws, req.params.searchTerm);
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