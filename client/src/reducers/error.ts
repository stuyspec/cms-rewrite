import { createSlice } from "@reduxjs/toolkit";

interface ErrorState {
    value: string;
}

const initialState: ErrorState = {
    value: "",
}

export const errorSlice = createSlice({
    name: "error",
    initialState: initialState,
    reducers: {
        setError: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
