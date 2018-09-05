import React from "react";
import {shallow, mount} from "enzyme";
import {SearchBar} from "./Search";

describe("<SearchBar />", () => {
	it("renders without crashing", () => {
		shallow(<SearchBar/>);
	});
});