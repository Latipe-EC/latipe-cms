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
		async (query: Record<string, string>) => {
			const response = await api.order.getMyOrder(query);
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
	countMyOrder = createAsyncThunk(
		'orders/countMyOrder',
		async () => {
			const response = await api.order.countMyOrder();
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
		count: 0,
		loading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder.addCase(countMyOrder.fulfilled, (state, action) => {
			state.count = action.payload.data.data.count;
		})
	},
	reducers: {

	}
});

export const selectOrders = (state) => state.order;
export default orderSlice.reducer;
