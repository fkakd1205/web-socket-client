import { legacy_createStore as createStore } from "redux";
import userReducer from "./reducer/user";

const store = createStore(userReducer);

export default store;
