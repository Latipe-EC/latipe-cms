import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { PayByPaypalRequest, PayOrderRequest, validWithdrawPayPalRequest, withdrawPayPalRequest } from 'api/interface/payment';

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
	extraReducers: () => {

	},
	reducers: {

	}
});

export const selectPayments = (state) => state.payment;
