import React from "react";
import { connect } from 'react-redux';
import {shallow, mount} from "enzyme";
import {App} from "./App";

describe("<App />", () => {
	it("renders without crashing", () => {
		shallow(<App/>);
	});
});