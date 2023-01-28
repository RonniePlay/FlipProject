import { authReducer } from "../Components/Auth/store/reducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
    auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;