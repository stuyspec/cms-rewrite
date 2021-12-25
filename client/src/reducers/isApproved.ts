import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IsApprovedState {
	value: boolean;
}

// Define the initial state using that type
const initialState: IsApprovedState = {
	value: false,
};

export const isApprovedSlice = createSlice({
	name: "isApproved",
	initialState: initialState,
	reducers: {
		setIsApproved: (state, action: { type: string; payload: boolean }) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setIsApproved } = isApprovedSlice.actions;

export default isApprovedSlice.reducer;
