import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ValidauthtokenState {
	value: string;
}

// Define the initial state using that type
const initialState: ValidauthtokenState = {
	value: "",
};

export const validauthtokenSlice = createSlice({
	name: "validauthtoken",
	initialState: initialState,
	reducers: {
		setToken: (state, action) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setToken } = validauthtokenSlice.actions;

export default validauthtokenSlice.reducer;
