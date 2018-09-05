import React, { Component } from "react";
import {connect} from "react-redux";
import "./App.css";
import "./main.css";
import SearchBar from "./Search";
import Table from "./ReactTable";
import {fetchSearchTermData, exportExcel} from "../actions";
import Footer from "./Footer";
import ExportExcel from './ExportExcel';

export class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="App container">
				<header className="App-header">
					<h1 className="App-title">Json-to-Excel</h1>
				</header>
				<main>
					<div className="main">
						<SearchBar 
							getSearchTermData={(getData) => this.props.dispatch(fetchSearchTermData(getData)
							)}
						/>
						<ExportExcel exportExcel={() => this.props.dispatch(exportExcel()
						)}
						/>
						<br />
						<Table />
					</div>
				</main>
				<footer><Footer /></footer>
			</div>
		);
	}
}

const mapStoreToProps = (store) => ({
	main: store.main.searchTerm,
});


export default connect(mapStoreToProps)(App);