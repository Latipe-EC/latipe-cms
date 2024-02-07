import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import {
	PayByPaypalRequest,
	PayOrderRequest,
	validWithdrawPayPalRequest,
	withdrawPayPalRequest
} from '@interfaces/payment';

const api = new Api();

export const
	checkPaymentOrder = createAsyncThunk(
		'payments/checkPaymentOrder',
		async (id: string) => {
			const response = await api.payment.checkPaymentOrder(id);
			return response;
		}
	);

export const
	validPayment = createAsyncThunk(
		'payments/validPayment',
		async (request: PayOrderRequest) => {
			const response = await api.payment.validPayment(request);
			return response;
		}
	);

export const
	payByPaypal = createAsyncThunk(
		'payments/payByPaypal',
		async (request: PayByPaypalRequest) => {
			const response = await api.payment.payByPaypal(request);
			return response;
		}
	);

export const
	withdrawPayPal = createAsyncThunk(
		'payments/withdrawPayPal',
		async (request: withdrawPayPalRequest) => {
			const response = await api.payment.withdrawPayPal(request);
			return response;
		}
	);

export const
	validWithdrawPayPal = createAsyncThunk(
		'payments/validWithdrawPayPal',
		async (request: validWithdrawPayPalRequest) => {
			const response = await api.payment.validWithdrawPayPal(request);
			return response;
		}
	);

export const
	getPaginatePayment = createAsyncThunk(
		'payments/getPaginatePayment',
		async (params: QueryParamsType) => {
			const response = await api.payment.getPaginatePayment(params);
			return response;
		}
	);

export const paymentSlice = createSlice({
	name: 'payment',
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
		builder.addCase(getPaginatePayment.fulfilled, (state, action) => {
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
			.addCase(getPaginatePayment.rejected, (state) => {
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

export const selectPayments = (state) => state.payment;
export default paymentSlice.reducer;
