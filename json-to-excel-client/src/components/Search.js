import React, {Component} from "react";
import {connect} from "react-redux";

export class SearchBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchTerm: ""
		};
	}
  
	handleSubmit(e){
		e.preventDefault();
		this.props.getSearchTermData({
			searchTerm: this.state.searchTerm
		});
	}
	render() {
		return (
			<div className="search-form">
				<form  onSubmit={this.handleSubmit.bind(this)}>
					<div>
						<input 
							type="text" 
							name="search-bar" 
							placeholder="Searching for.." 
							value={this.state.searchTerm}
							onChange={(e) => this.setState({searchTerm: e.target.value})}
						/>
					</div>
					<br/>
					<input className="button"
						type="submit" 
						value="Go"
						disabled={!this.state.searchTerm}
					/>
				</form>
				<br />
			</div>
		);
	}  
}

const mapStoreToProps = (store) => ({
	searchTerm: store.main.searchTerm
});

export default connect(mapStoreToProps)(SearchBar);