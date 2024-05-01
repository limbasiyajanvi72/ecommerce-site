import { createSlice } from "@reduxjs/toolkit";
import { filterSliceState } from "../initialStates/filterSliceState";

const filterSlice = createSlice({
	name: "filterSlice",
	initialState: filterSliceState,
	reducers: {
		setCompanyFilters: (state, action) => {
			state.filterCompanyData = action.payload;
		},
		setIsCompanyChecked: (state, action) => {
			state.isCompanyCheck = action.payload;
		},

		setCategoryFilters: (state, action) => {
			state.filterCategoryData = action.payload;
		},
		setIsCategoryChecked: (state, action) => {
			state.isCategoryCheck = action.payload;
		},

		setIsColorChecked: (state, action) => {
			state.isColorCheck = action.payload;
		},
		setColorFilters: (state, action) => {
			state.filterColorData = action.payload;
		},

		setPriceRange: (state, action) => {
			state.filterPriceRange = action.payload;
		},

		setIsfreeDeliveryAvaialable: (state, action) => {
			state.isFreeDeliveryAvailable = action.payload;
		},

		setMaxPrice: (state, action) => {
			state.maxPrice = action.payload;
		},
		setIsPriceRangeSet: (state, action) => {
			state.isPriceRangeSet = action.payload;
		},
		setIsOpenFilter: (state, action) => {
			state.isOpenFilter = action.payload;
		},
	},
});

export const filterSliceReducers = filterSlice.reducer;
export const filterSliceActions = filterSlice.actions;
