import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateRatingRequest, UpdateRatingRequest } from 'api/interface/rating';

const api = new Api();

export const create = createAsyncThunk(
	'ratings/create',
	async (input: CreateRatingRequest) => {
		const response = await api.rating.create(input);
		return response;
	}
);

export const update = createAsyncThunk(
	'ratings/update',
	async (input: UpdateRatingRequest) => {
		const response = await api.rating.update(input.id, input);
		return response;
	}
);

export const deleteRating = createAsyncThunk(
	'ratings/delete',
	async (id: string) => {
		const response = await api.rating.remove(id);
		return response;
	}
);


export const getRatingDetail = createAsyncThunk(
	'ratings/detail-rating',
	async (id: string) => {
		const response = await api.rating.getDetailRating(id);
		return response;
	}
);

export const getRatingStore = createAsyncThunk(
	'ratings/rating-store',
	async (params: QueryParamsType) => {
		const response = await api.rating.getRatingStore(params);
		console.log(response);
		return response;
	}
);

export const getgetRatingProduct = createAsyncThunk(
	'ratings/rating-products',
	async (params: QueryParamsType) => {
		const response = await api.rating.getRatingProduct(params);
		return response;
	}
);

export const ratingsSlice = createSlice({
	name: 'ratings',
	initialState: {
		rating: null,
		ratingProducts: [],
		ratingStores: [],
		banProducts: [],
		paginationStore: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		paginationProduct: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		isLoading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getRatingStore.fulfilled, (state, action) => {
				state.isLoading = false;
				state.ratingStores = action.payload.data.data;
				state.paginationStore.total = action.payload.data.pagination.total;
				state.paginationStore.skip = action.payload.data.pagination.skip;
				state.paginationStore.limit = action.payload.data.pagination.limit;
			})
			.addCase(getgetRatingProduct.fulfilled, (state, action) => {
				state.isLoading = false;
				state.ratingProducts = action.payload.data.data;
				state.paginationProduct.total = action.payload.data.pagination.total;
				state.paginationProduct.skip = action.payload.data.pagination.skip;
				state.paginationProduct.limit = action.payload.data.pagination.limit;
			})
			.addCase(getRatingDetail.fulfilled, (state, action) => {
				state.isLoading = false;
				state.rating = action.payload.data;
			})

	},
	reducers: {

	}
});

export const selectStores = (state) => state.ratings;

export default ratingsSlice.reducer;
