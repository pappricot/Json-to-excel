import React from "react";
import {shallow, mount} from "enzyme";
import ExportExcel from "./ExportExcel";

describe("<ExportExcel />", () => {
	it("renders without crashing", () => {
		shallow(<ExportExcel />);
	});
});