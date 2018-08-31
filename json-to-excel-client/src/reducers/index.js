"use strict";
import {GET_SEARCH_RESULTS_SUCCESS} from "../actions";

const initialState = {
	searchTerm: "",
	searchResults: {}
};

export default function reducerMain(state=initialState, action) {
	if (action.type === GET_SEARCH_RESULTS_SUCCESS) {
		return Object.assign({}, state, {
			searchResults: action.searchResults
		});
	}
	return state;
}