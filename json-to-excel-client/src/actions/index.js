"use strict";
import {API_BASE_URL} from "../config"; //wait to use for thunks

export const normalizeResponseErrors = res => {
	if (!res.ok) {
		if (
			res.headers.has("content-type") &&
            res.headers.get("content-type").startsWith("application/json")
		) {
			return res.json().then(err => Promise.reject(err));
		}
		return Promise.reject({
			code: res.status,
			message: res.statusText
		});
	}
	return res;
};


export const GET_SEARCH_RESULTS_SUCCESS = "GET_SEARCH_RESULTS_SUCCESS";
export const getSearchResultsSuccess = (searchResults) => ({
	type: GET_SEARCH_RESULTS_SUCCESS,
	searchResults
});

export const GET_SEARCH_RESULTS_FAILURE = "GET_SEARCH_RESULTS_FAILURE";
export const getSearchResultsFailure = (err) => ({
	type: GET_SEARCH_RESULTS_FAILURE,
	err
});

export const fetchSearchTermData = ({searchTerm}) => (dispatch, getState) => {
	dispatch(getSearchResultsPending(searchTerm));
	return fetch(`${API_BASE_URL}/finalResult/${searchTerm}`, {
		method: "GET"
	})
		.then(res => normalizeResponseErrors(res))
		.then(res => res.json())
		.then(results => dispatch(getSearchResultsSuccess(results)))
		.catch(() => dispatch(getSearchResultsFailure("There was an error.")));

};

export const GET_SEARCH_RESULTS_PENDING = "GET_SEARCH_RESULTS_PENDING";
export const getSearchResultsPending = () => ({
	type: GET_SEARCH_RESULTS_PENDING,
});

export const exportExcel = () => (dispatch, getState) => {
	fetch(`${API_BASE_URL}/searchExport/${getState().main.searchResults._id}`, {
		method: "GET"
	})
		.then(res => normalizeResponseErrors(res))
		.then(res => res.json())
		.catch(() => dispatch(getSearchResultsFailure("There was an error.")));
};