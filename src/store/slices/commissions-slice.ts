import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateCommissionRequest, UpdateCommissionRequest } from 'api/interface/commission';

const api = new Api();

export const createCommission = createAsyncThunk(
	'commissions/createCommission',
	async (input: CreateCommissionRequest) => {
		const response = await api.commission.createCommission(input);
		return response;
	}
);

export const updateCommission = createAsyncThunk(
	'commissions/updateCommission',
	async (input: UpdateCommissionRequest) => {
		const response = await api.commission.updateCommission(input);
		return response;
	}
);

export const deleteCommission = createAsyncThunk(
	'commissions/deleteCommission',
	async (id: string) => {
		const response = await api.commission.deleteCommission(id);
		return response;
	}
);

export const getPaginateCommission = createAsyncThunk(
	'commissions/getPaginateCommission',
	async (params: QueryParamsType) => {
		const response = await api.commission.getPaginateCommission(params);
		return response;
	}
);

export const commissionsSlice = createSlice({
	name: 'commissions',
	initialState: {
		commission: null,
		data: [],
		pagination: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		isLoading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createCommission.fulfilled, (state, action) => {
				if (action.payload.status !== 201) {
					return;
				}
				state.isLoading = false;
				state.data.push(action.payload.data);
				state.pagination.total++;
			})
			.addCase(deleteCommission.fulfilled, (state, action) => {
				if (action.payload.status !== 200) {
					return;
				}
				state.isLoading = false;
				const id = action.meta.arg;
				state.data = state.data.filter((item) => item.id !== id);
				state.pagination.total--;
			})
			.addCase(updateCommission.fulfilled, (state, action) => {
				if (action.payload.status !== 200) {
					return;
				}
				state.isLoading = false;
				const index = state.data.findIndex((item) => item.id === action.payload.data.id);
				state.data[index] = action.payload.data;
			})
			.addCase(getPaginateCommission.fulfilled, (state, action) => {
				if (action.payload.status !== 200) {
					state.data = [];
					state.pagination = {
						total: 0,
						skip: 0,
						limit: 10,
					}
					return;
				}
				state.data = action.payload.data.data;
				state.pagination = {
					total: action.payload.data.pagination.total,
					skip: action.payload.data.pagination.skip,
					limit: action.payload.data.pagination.limit,
				}
			})
			.addCase(getPaginateCommission.rejected, (state) => {
				state.data = [];
				state.pagination = {
					total: 0,
					skip: 0,
					limit: 10,
				}
			})

	},
	reducers: {

	}
});

export const selectCommissions = (state) => state.commissions;

export default commissionsSlice.reducer;
