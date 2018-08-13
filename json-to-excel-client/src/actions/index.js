import {API_BASE_URL} from '../config'; //wait to use for thunks

export const normalizeResponseErrors = res => {
    if (!res.ok) {
        if (
            res.headers.has('content-type') &&
            res.headers.get('content-type').startsWith('application/json')
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


export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const getEventsSuccess = (events) => ({
    type: GET_EVENTS_SUCCESS,
    events
})

export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';
export const getEventsFailure = (err) => ({
    type: GET_EVENTS_FAILURE,
    err
})

const getSearchTermData = (searchTerm) => (dispatch, getState) => {
    fetch(`${API_BASE_URL}/allData/${searchTerm}`, {
        method: 'GET'
    })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(events => dispatch(getEventsSuccess(events)))
    .catch(err => dispatch(getEventsFailure('There was an error.')))

}