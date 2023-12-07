import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateStoreRequest, ProductStoreRequest, UpdateStoreRequest } from 'api/interface/store';

const api = new Api();

export const register = createAsyncThunk(
	'stores/register',
	async (input: CreateStoreRequest) => {
		const response = await api.store.registerStore(input);
		return response;
	}
);

export const update = createAsyncThunk(
	'stores/update',
	async (input: UpdateStoreRequest) => {
		const response = await api.store.update(input);
		return response;
	}
);

export const getMyProductBanStore = createAsyncThunk(
	'stores/my-products/ban',
	async (params: QueryParamsType) => {
		const response = await api.store.getMyProductBanStore(params);
		return response;
	}
);

export const getMyProductStore = createAsyncThunk(
	'stores/my-products',
	async (params: QueryParamsType) => {
		const response = await api.store.getMyProductStore(params);
		return response;
	}
);


export const getProductStore = createAsyncThunk(
	'stores/getProductStore',
	async (request: ProductStoreRequest) => {
		const response = await api.store.getProductStore(request);
		return response;
	}
);

export const getStoreById = createAsyncThunk(
	'stores/getStoreById',
	async (id: string) => {
		const response = await api.store.getStoreById(id);
		return response;
	}
);

export const storesSlice = createSlice({
	name: 'stores',
	initialState: {
		store: null,
		products: [],
		banProducts: [],
		pagination: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		paginationBan: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		isLoading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getMyProductStore.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload.data.data;
				state.pagination.total = action.payload.data.pagination.total;
				state.pagination.skip = action.payload.data.pagination.skip;
				state.pagination.limit = action.payload.data.pagination.limit;
			})
			.addCase(getMyProductBanStore.fulfilled, (state, action) => {
				state.isLoading = false;
				state.banProducts = action.payload.data.data;
				state.paginationBan.total = action.payload.data.pagination.total;
				state.paginationBan.skip = action.payload.data.pagination.skip;
				state.paginationBan.limit = action.payload.data.pagination.limit;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.store = action.payload.data;
			})
			.addCase(update.fulfilled, (state, action) => {
				state.store = action.payload.data;
			})
	},
	reducers: {

	}
});

export const selectStores = (state) => state.stores;

export default storesSlice.reducer;
