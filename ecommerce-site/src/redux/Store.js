import { configureStore } from "@reduxjs/toolkit";
import { productSliceReducers } from "./Slice/productSlice";
import { filterSliceReducers } from "./Slice/filterSlice";
import { searchSliceReducers } from "./Slice/searchSlice";

export const Store = configureStore({
	reducer: {
		product: productSliceReducers,
		filter: filterSliceReducers,
		search: searchSliceReducers,
	},
});
