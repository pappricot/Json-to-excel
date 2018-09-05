var google = require('google')

google.resultsPerPage = 10
var nextCounter = 0

google('macbook 2018', function (err, res){
  if (err) console.error(err)

  for (var i = 0; i < res.links.length; ++i) {
    var link = res.links[i];
    console.log(link.title + ' - ' + link.href)
    console.log(link.description + "\n")
  }

  if (nextCounter < 4) {
    nextCounter += 1
    if (res.next) res.next()
  }
})