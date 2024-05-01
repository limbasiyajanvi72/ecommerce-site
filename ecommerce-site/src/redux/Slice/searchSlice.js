import { createSlice } from "@reduxjs/toolkit";
import { searchSliceState } from "../initialStates/searchSliceState";

const searchSlice = createSlice({
	name: "searchSlice",
	initialState: searchSliceState,
	reducers: {
		setSearchItems: (state, action) => {
			state.searchItems = action.payload;
		},
	},
});

export const searchSliceReducers = searchSlice.reducer;
export const searchSliceActions = searchSlice.actions;
