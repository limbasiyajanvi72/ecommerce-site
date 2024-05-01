import { createSlice } from "@reduxjs/toolkit";
import { productSliceState } from "../initialStates/productSliceState";

const productSlice = createSlice({
	name: "productSlice",
	initialState: productSliceState,
	reducers: {
		setProducts: (state, action) => {
			state.productListData = action.payload;
		},
	},
});

export const productSliceReducers = productSlice.reducer;
export const productSliceActions = productSlice.actions;
