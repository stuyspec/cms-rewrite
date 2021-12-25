import { configureStore } from "@reduxjs/toolkit";
import validauthtokenReducer from "./reducers/validAuthToken";
import isAdminReducer from "./reducers/isAdmin";
import isApprovedReducer from "./reducers/isApproved";

const store = configureStore({
	reducer: {
		validauthtoken: validauthtokenReducer,
		isAdmin: isAdminReducer,
		isApproved: isApprovedReducer,
	},
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
