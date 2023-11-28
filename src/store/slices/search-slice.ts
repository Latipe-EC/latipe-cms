import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';

const api = new Api();

export const searchProduct = createAsyncThunk(
	'search',
	async (input: QueryParamsType) => {
		const response = await api.search.searchProduct(input);
		return response;
	}
);

export const autoComplete = createAsyncThunk(
	'autocomplete',
	async (input: QueryParamsType) => {
		const response = await api.search.autoComplete(input);
		return response;
	}
);

export const searchSlice = createSlice({
	name: 'search',
	initialState: {
		data: [],
		loading: false,
		error: null,
	},

	reducers: {

	}
});

export const selectsearch = (state) => state.search;

export default searchSlice.reducer;
