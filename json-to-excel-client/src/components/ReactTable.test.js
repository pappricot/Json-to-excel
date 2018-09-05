import React from "react";
import {shallow, mount} from "enzyme";
import ReactTable from "react-table";
import {Table} from "./ReactTable";

describe("<ReactTable />", () => {
	it("renders without crashing", () => {
		shallow(<Table/>);
	});
});