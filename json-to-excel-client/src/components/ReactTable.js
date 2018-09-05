import React from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";

export class Table extends React.Component {
	render() {
		const data = this.props.data;
		const columns = [{
			Header: "Title",
			accessor: "title" // String-based value accessors!
		},
		{
			Header: "Link",
			accessor: "link", // String-based value accessors!
			Cell: props => <a href={props.value} className='link'>{props.value} </a> // Custom cell components
		},
		{
			Header: "Date",
			accessor: "date" // String-based value accessors!
		},
		{
			Header: "Summary",
			accessor: "summary" // String-based value accessors!
		}
		];
		// console.log("Hyperlink", data[0]);
		// console.log("Hyperlink2", Object.values(data[0]));
		// //givdes underfined though I expect to get the url string
		// console.log("Hyperlink2", Object.values(data[0])[7]); // terrible
		// console.log("Hyperlink2", (data[0].Hyperlink));
		return(
			<ReactTable
				data={data}
				columns={columns}
			/>
		);
      
	}
}

const mapStateToProps = (state) =>  ({
	data: state.main.searchResults.results
});

export default connect(mapStateToProps)(Table);

