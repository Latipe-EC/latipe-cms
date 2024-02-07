import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import {
	CalculateShippingOrderRequest,
	CreateDeliveryRequest,
	ListDeliveryRequest,
	UpateDeliveryRequest
} from '@interfaces/delivery';

const api = new Api();

export const
	createDelivery = createAsyncThunk(
		'deliveries/createDelivery',
		async (request: CreateDeliveryRequest) => {
			const response = await api.delivery.createDelivery(request);
			return response;
		}
	);

export const
	upateDelivery = createAsyncThunk(
		'deliveries/upateDelivery',
		async (request: UpateDeliveryRequest) => {
			const response = await api.delivery.upateDelivery(request);
			return response;
		}
	);

export const
	upateStatusDelivery = createAsyncThunk(
		'deliveries/upateStatusDelivery',
		async (request: { id: string, status: boolean }) => {
			const response = await api.delivery.upateStatusDelivery(request);
			return response;
		}
	);

export const
	calculateShippingOrder = createAsyncThunk(
		'deliveries/calculateShippingOrder',
		async (request: CalculateShippingOrderRequest) => {
			const response = await api.delivery.calculateShippingOrder(request);
			return response;
		}
	);

export const
	getListDelivery = createAsyncThunk(
		'deliveries/getListDelivery',
		async (request: ListDeliveryRequest) => {
			const response = await api.delivery.getListDelivery(request);
			return response;
		}
	);

export const
	getAdminListDelivery = createAsyncThunk(
		'deliveries/getAdminListDelivery',
		async () => {
			const response = await api.delivery.getAdminListDelivery();
			return response;
		}
	);

export const deliverySlice = createSlice({
	name: 'delivery',
	initialState: {
		data: [],
		pagination: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		loading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder.addCase(getAdminListDelivery.fulfilled, (state, action) => {
			if (action.payload.status !== 200) {
				state.data = [];
				state.pagination = {
					total: 0,
					skip: 0,
					limit: 10,
				}
				return;
			}
			state.data = action.payload.data;
		})
			.addCase(getAdminListDelivery.rejected, (state) => {
				state.data = [];
				state.pagination = {
					total: 0,
					skip: 0,
					limit: 10,
				}
			})

	},
	reducers: {}
});

export const selectDeliveries = (state) => state.delivery;

export default deliverySlice.reducer;