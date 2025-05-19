import { createStore, combineReducers } from 'redux';
import loginReducer from "../../../pages/State/LoginReducer";

const rootReducer = combineReducers({
  loginReducer: loginReducer,
});

const store = createStore(rootReducer);

export default store;