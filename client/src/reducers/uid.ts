import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface UIDState {
	value: string;
}

// Define the initial state using that type
const initialState: UIDState = {
	value: "",
};

export const uidSlice = createSlice({
	name: "uid",
	initialState: initialState,
	reducers: {
		setuid: (state, action: { type: string; payload: string }) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setuid } = uidSlice.actions;

export default uidSlice.reducer;
