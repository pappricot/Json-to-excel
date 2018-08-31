import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import {reducer as formReducer} from "redux-form";
import thunk from "redux-thunk";
// import {loadAuthToken} from './local-storage';
// import authReducer from './reducers/auth';
// import protectedDataReducer from './reducers/protected-data';
// import {setAuthToken, refreshAuthToken} from './actions/auth';
import reducers from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	combineReducers({
		main: reducers,
		form: formReducer
	}), 
	composeEnhancers(
		applyMiddleware(thunk)
	));

export default store;