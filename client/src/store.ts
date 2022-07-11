import { configureStore } from "@reduxjs/toolkit";
import validauthtokenReducer from "./reducers/validAuthToken";
import isAdminReducer from "./reducers/isAdmin";
import isApprovedReducer from "./reducers/isApproved";
import uidReducer from "./reducers/uid";
import errorReducer from "./reducers/error"

const store = configureStore({
	reducer: {
		validauthtoken: validauthtokenReducer,
		isAdmin: isAdminReducer,
		isApproved: isApprovedReducer,
		uid: uidReducer,
		error: errorReducer,
	},
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
