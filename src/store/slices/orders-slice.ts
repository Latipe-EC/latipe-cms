import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { CancelOrderRequest, CreateOrderRequest } from 'api/interface/order';

const api = new Api();

export const
	createOrder = createAsyncThunk(
		'orders/create-order',
		async (request: CreateOrderRequest) => {
			const response = await api.order.createOrder(request);
			return response;
		}
	);

export const
	getMyOrder = createAsyncThunk(
		'orders/getMyOrder',
		async () => {
			const response = await api.order.getMyOrder();
			return response;
		}
	);

export const
	cancelOrder = createAsyncThunk(
		'orders/cancelOrder',
		async (request: CancelOrderRequest) => {
			const response = await api.order.cancelOrder(request);
			return response;
		}
	);

export const
	getOrderById = createAsyncThunk(
		'orders/getOrderById',
		async (id: string) => {
			const response = await api.order.getOrderById(id);
			return response;
		}
	);

export const orderSlice = createSlice({
	name: 'order',
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

export const selectOrders = (state) => state.order;
