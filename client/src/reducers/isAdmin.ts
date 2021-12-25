import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IsAdminState {
	value: boolean;
}

// Define the initial state using that type
const initialState: IsAdminState = {
	value: false,
};

export const isAdminSlice = createSlice({
	name: "validauthtoken",
	initialState: initialState,
	reducers: {
		setIsAdmin: (state, action: { type: string; payload: boolean }) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setIsAdmin } = isAdminSlice.actions;

export default isAdminSlice.reducer;
