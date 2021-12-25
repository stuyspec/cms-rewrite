import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface CounterState {
	value: string;
}

// Define the initial state using that type
const initialState: CounterState = {
	value: "",
};

export const counterSlice = createSlice({
	name: "counter",
	initialState: initialState,
	reducers: {
		setToken: (state, action) => {
			state.value = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setToken } = counterSlice.actions;

export default counterSlice.reducer;
