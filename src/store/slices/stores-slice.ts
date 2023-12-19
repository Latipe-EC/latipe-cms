import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import {
	CreateStoreRequest,
	ProductStoreRequest,
	UpdateBanStoreRequest,
	UpdateStoreRequest
} from 'api/interface/store';

const api = new Api();

export const registerStore = createAsyncThunk(
	'stores/register',
	async (request: CreateStoreRequest) => {
		if (request.coverFile) {
			const file = await api.media.uploadFile({ file: request.coverFile });
			if (file.status !== 201)
				throw new Error("Some thing went wrong");
			request.cover = file.data.url;
		}
		if (request.logoFile) {
			const file = await api.media.uploadFile({ file: request.logoFile });
			if (file.status !== 201)
				throw new Error("Some thing went wrong");
			request.logo = file.data.url;
		}
		const response = await api.store.registerStore(request);
		return response;
	}
);

export const updateMyStore = createAsyncThunk(
	'stores/updateMyStore',
	async (request: UpdateStoreRequest) => {
		if (request.coverFile) {
			const file = await api.media.uploadFile({ file: request.coverFile });
			if (file.status !== 201)
				throw new Error("Some thing went wrong");
			request.cover = file.data.url;
		}
		if (request.logoFile) {
			const file = await api.media.uploadFile({ file: request.logoFile });
			if (file.status !== 201)
				throw new Error("Some thing went wrong");
			request.logo = file.data.url;
		}
		const response = await api.store.updateMyStore(request);

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

export const getMyStore = createAsyncThunk(
	'stores/getMyStore',
	async () => {
		const response = await api.store.getMyStore();
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

export const getAdminStore = createAsyncThunk(
	'stores/getAdminStore',
	async (params: QueryParamsType) => {
		const response = await api.store.getAdminStore(params);
		return response;
	}
);

export const updateBanStore = createAsyncThunk(
	'stores/updateBanStore',
	async (request: UpdateBanStoreRequest) => {
		const response = await api.store.updateBanStore(request);
		return response;
	}
);

export const countAllStore = createAsyncThunk(
	'Stores/countAllStore',
	async () => {
		const response = await api.store.countAllStore();
		return response;
	}
);


export const storesSlice = createSlice({
	name: 'stores',
	initialState: {
		store: null,
		products: [],
		banProducts: [],
		stores: [],
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
			.addCase(registerStore.fulfilled, (state, action) => {
				state.store = action.payload.data;
			})
			.addCase(updateMyStore.fulfilled, (state, action) => {
				state.store = action.payload.data;
			}).addCase(getAdminStore.fulfilled, (state, action) => {
				if (action.payload.status !== 200) {
					state.stores = [];
					state.pagination = {
						total: 0,
						skip: 0,
						limit: 10,
					}
					return;
				}
				state.stores = action.payload.data.data;
				state.pagination = {
					total: action.payload.data.pagination.total,
					skip: action.payload.data.pagination.skip,
					limit: action.payload.data.pagination.limit,
				}
			})
			.addCase(getAdminStore.rejected, (state) => {
				state.stores = [];
				state.pagination = {
					total: 0,
					skip: 0,
					limit: 10,
				}
			})
			.addCase(updateBanStore.fulfilled, (state, action) => {
				const index = state.stores.findIndex(x => x.id === JSON.parse(action.payload.config.data).id);
				const isBanned = JSON.parse(action.payload.config.data).isBanned;
				state.stores[index].isBan = isBanned;
				console.log(action.payload.config.data);
				if (isBanned)
					state.stores[index].reasonBan = JSON.parse(action.payload.config.data).reason;
				else
					state.stores[index].reasonBan = null;
			})
	},
	reducers: {}
});

export const selectStores = (state) => state.stores;

export default storesSlice.reducer;
