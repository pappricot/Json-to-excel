import * as actions from "./index";

describe("action", () => {
	it("getSearchResultsSuccess", () => {
		const searchResults = "Test Search Term";
		const expectedAction = {
			type: "GET_SEARCH_RESULTS_SUCCESS",
			searchResults
		};
		expect(actions.getSearchResultsSuccess(searchResults)).toEqual(expectedAction);
	});
});