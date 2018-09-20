# JSOn-to-Excel (aka Scrape Me)

This is the server side of JSON-to-Excel app at https://github.com/pappricot/json-to-excel-client.
Follow instructions in above link's README file to run the app locally.

Live link: https://json-to-excel-client.herokuapp.com/

### Endpoints
In config.js file
```
export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
```
edit the default localhost or leave it as it is.

{API_BASE_URL}/searchExport/:id - import searchterm findings to an Excel spreadsheet name "Test.xlsx". If the searchterm exists, it appends new findings onto the same tab, if not, it creates new tab with the name of that searchterm and appends findings there.

{API_BASE_URL}/allData/:sheetName - get json results based on the excel's tab name.

{API_BASE_URL}/finalResult/:searchTerm - get search term findings from request.

### Technology
MongoDB Mongoose
Express
XLSX
CORS
Cheerio
Selenium

### Special Note
Selenium works seemlessly locally, but gives unstable results in the deployed version.
