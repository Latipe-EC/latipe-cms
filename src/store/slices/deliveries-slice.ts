

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { calculateShippingOrderRequest, createDeliveryRequest, listDeliveryRequest } from 'api/interface/delivery';

const api = new Api();

export const
	createDelivery = createAsyncThunk(
		'deliveries/createDelivery',
		async (request: createDeliveryRequest) => {
			const response = await api.delivery.createDelivery(request);
			return response;
		}
	);

export const
	calculateShippingOrder = createAsyncThunk(
		'deliveries/calculateShippingOrder',
		async (request: calculateShippingOrderRequest) => {
			const response = await api.delivery.calculateShippingOrder(request);
			return response;
		}
	);

export const
	getListDelivery = createAsyncThunk(
		'deliveries/getListDelivery',
		async (request: listDeliveryRequest) => {
			const response = await api.delivery.getListDelivery(request);
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
	extraReducers: () => {

	},
	reducers: {

	}
});

export const selectDeliveries = (state) => state.delivery;










