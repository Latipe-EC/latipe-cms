import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CancelOrderRequest, CreateOrderRequest, StatusBodyRequest } from 'api/interface/order';

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

export const
	searchStoreOrder = createAsyncThunk(
		'orders/searchStoreOrder',
		async (params: Record<string, string>) => {
			const response = await api.order.searchStoreOrder(params);
			return response;
		}
	);

export const
	updateOrderItemStatusByStore = createAsyncThunk(
		'orders/updateOrderItemStatusByStore',
		async (params: StatusBodyRequest) => {
			const response = await api.order.updateOrderItemStatusByStore(params);
			return response;
		}
	);

export const
	getStoreOrderDetail = createAsyncThunk(
		'orders/getStoreOrderDetail',
		async (id: string) => {
			const response = await api.order.getStoreOrderDetail(id);
			return response;
		}
	);

export const
	cancelOrderItem = createAsyncThunk(
		'orders/cancelOrderItem',
		async (request: StatusBodyRequest) => {
			const response = await api.order.cancelOrderItem(request);
			return response;
		}
	);

export const
	getTotalOrderInMonth = createAsyncThunk(
		'orders/getTotalOrderInMonth',
		async (params: QueryParamsType) => {
			const response = await api.order.getTotalOrderInMonth(params);
			return response;
		}
	);

export const
	getTotalOrderInYear = createAsyncThunk(
		'orders/getTotalOrderInYear',
		async (params: QueryParamsType) => {
			const response = await api.order.getTotalOrderInYear(params);
			return response;
		}
	);

export const
	getTotalCommission = createAsyncThunk(
		'orders/getTotalCommission',
		async (params: QueryParamsType) => {
			const response = await api.order.getTotalCommission(params);
			return response;
		}
	);

export const
	getProductBestSeller = createAsyncThunk(
		'orders/getProductBestSeller',
		async (params: QueryParamsType) => {
			const response = await api.order.getProductBestSeller(params);
			return response;
		}
	);

export const
	searchOrderAdmin = createAsyncThunk(
		'orders/searchOrderAdmin',
		async (params: Record<string, string>) => {
			const response = await api.order.searchOrderAdmin(params);
			return response;
		}
	);

export const
	searchOrderDelivery = createAsyncThunk(
		'orders/searchOrderDelivery',
		async (params: Record<string, string>) => {
			const response = await api.order.searchOrderDelivery(params);
			return response;
		}
	);

export const
	getAdminOrderDetail = createAsyncThunk(
		'orders/getAdminOrderDetail',
		async (id: string) => {
			const response = await api.order.getAdminOrderDetail(id);
			return response;
		}
	);

export const
	getTotalOrderInMonthAdmin = createAsyncThunk(
		'orders/getTotalOrderInMonthAdmin',
		async (params: QueryParamsType) => {
			const response = await api.order.getTotalOrderInMonthAdmin(params);
			return response;
		}
	);

export const
	getTotalOrderInYearAdmin = createAsyncThunk(
		'orders/getTotalOrderInYearAdmin',
		async (params: QueryParamsType) => {
			const response = await api.order.getTotalOrderInYearAdmin(params);
			return response;
		}
	);

export const
	getTotalCommissionAdmin = createAsyncThunk(
		'orders/getTotalCommissionAdmin',
		async (params: QueryParamsType) => {
			const response = await api.order.getTotalCommissionAdmin(params);
			return response;
		}
	);

export const
	getProductBestSellerAdmin = createAsyncThunk(
		'orders/getProductBestSellerAdmin',
		async (params: QueryParamsType) => {
			const response = await api.order.getProductBestSellerAdmin(params);
			return response;
		}
	);

export const
	getOrderDaysAdmin = createAsyncThunk(
		'orders/getOrderDaysAdmin',
		async (params: QueryParamsType) => {
			const response = await api.order.getOrderDaysAdmin(params);
			return response;
		}
	);

export const
	countAllOrder = createAsyncThunk(
		'orders/CountAllOrderResponse',
		async () => {
			const response = await api.order.countAllOrder();
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
