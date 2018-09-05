import reducer from "./index";

describe("reducer", () => {
	it("should return initial state", () => {
		expect(reducer(undefined, {})).toEqual({
			    searchTerm: "",
	            searchResults: {}           
		});
	});
});