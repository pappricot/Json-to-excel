const mongoose = require('mongoose');
const {SearchResults} = require('../model');
const index = require('../index');
const mondoDB_URI = "mongodb://anya:anya123@ds119652.mlab.com:19652/json-to-excel";
mongoose.connect(mondoDB_URI);

process.env.TEST_SUITE = 'spacetime-systems-test';

describe("Search Results model test", () => {
    beforeAll(async () => {
        await SearchResults.remove({});
    });

    afterEach(async () => {
        await SearchResults.remove({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("has a module", () => {
        expect(SearchResults).toBeDefined();
    });
    
    
})
