import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { ApplyVoucherRequest, CheckingVoucherRequest, UpdateStatusVoucher, createVoucherRequest } from '@interfaces/promotion';

const api = new Api();

export const
	applyVoucher = createAsyncThunk(
		'promotions/applyVoucher',
		async (request: ApplyVoucherRequest) => {
			const response = await api.promotion.applyVoucher(request);
			return response;
		}
	);

export const
	createVoucher = createAsyncThunk(
		'promotions/createVoucher',
		async (request: createVoucherRequest) => {
			const response = await api.promotion.createVoucher(request);
			return response;
		}
	);

export const
	createVoucherVendor = createAsyncThunk(
		'promotions/createVoucherVendor',
		async (request: createVoucherRequest) => {
			const response = await api.promotion.createVoucherVendor(request);
			return response;
		}
	);

export const
	getById = createAsyncThunk(
		'promotions/getById',
		async (id: string) => {
			const response = await api.promotion.getById(id);
			return response;
		}
	);

export const
	getByCode = createAsyncThunk(
		'promotions/getByCode',
		async (code: string) => {
			const response = await api.promotion.getByCode(code);
			return response;
		}
	);

export const
	getVendorPromotionByCode = createAsyncThunk(
		'promotions/getVendorPromotionByCode',
		async (code: string) => {
			const response = await api.promotion.getVendorPromotionByCode(code);
			return response;
		}
	);


export const
	getAllPromotion = createAsyncThunk(
		'promotions/getAll',
		async (params: Record<string, string>) => {
			if (params["filters[voucher_type][$eq]"] == "0") {
				delete params["filters[voucher_type][$eq]"];
			}
			if (params["filters[is_expired][$eq]"] == "0") {
				delete params["filters[is_expired][$eq]"];
			}
			const response = await api.promotion.getAll(params);
			return response;
		}
	);

export const
	getAllVendorPromotion = createAsyncThunk(
		'promotions/getAllVendorPromotion',
		async (params: Record<string, string>) => {
			if (params["filters[voucher_type][$eq]"] == "0") {
				delete params["filters[voucher_type][$eq]"];
			}
			if (params["filters[is_expired][$eq]"] == "0") {
				delete params["filters[is_expired][$eq]"];
			}
			const response = await api.promotion.getAllVendorPromotion(params);
			return response;
		}
	);

export const
	getVoucherUser = createAsyncThunk(
		'promotions/get_voucher_user',
		async (params: Record<string, string>) => {
			if (params["filters[voucher_type][$eq]"] == "0") {
				delete params["filters[voucher_type][$eq]"];
			}
			if (params["filters[is_expired][$eq]"] == "0") {
				delete params["filters[is_expired][$eq]"];
			}
			const response = await api.promotion.getVoucherUser(params);
			return response;
		}
	);

export const
	checkVoucher = createAsyncThunk(
		'promotions/checkVoucher',
		async (request: CheckingVoucherRequest) => {
			const response = await api.promotion.checkVoucher(request);
			return response;
		}
	);

export const
	updateStatusVoucher = createAsyncThunk(
		'promotions/update-status-voucher',
		async (request: UpdateStatusVoucher) => {
			const response = await api.promotion.updateStatusVoucher(request);
			return response;
		}
	);

export const
	updateVendorStatusVoucher = createAsyncThunk(
		'promotions/update-status-voucher',
		async (request: UpdateStatusVoucher) => {
			const response = await api.promotion.updateVendorStatusVoucher(request);
			return response;
		}
	);

export const promotionSlice = createSlice({
	name: 'promotion',
	initialState: {
		data: [],
		pagination: {
			total: 0,
			page: 1,
			size: 10,
		},
		loading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllPromotion.fulfilled, (state, action) => {
				state.data = action.payload.data.data.items ? action.payload.data.data.items : [];
				state.pagination = {
					total: action.payload.data.data.total,
					size: action.payload.data.data.page,
					page: action.payload.data.data.size,
				};
			})
			.addCase(updateStatusVoucher.fulfilled, (state, action) => {
				const request = action.meta.arg;
				const index = state.data.findIndex((item) => item.voucher_code === request.code);
				if (index !== -1) {
					state.data[index].status = request.status;
				}
			})
			.addCase(createVoucher.fulfilled, (state, action) => {
				if (action.payload.status !== 200) return;
				const request = action.meta.arg;
				state.data.push({
					_id: action.payload.data,
					...request
				});
			}).addCase(getAllVendorPromotion.fulfilled, (state, action) => {
				state.data = action.payload.data.data.items ? action.payload.data.data.items : [];
				state.pagination = {
					total: action.payload.data.data.total,
					size: action.payload.data.data.page,
					page: action.payload.data.data.size,
				};

			}).addCase(createVoucherVendor.fulfilled, (state, action) => {
				if (action.payload.status !== 200) return;
				const request = action.meta.arg;
				state.data.push({
					...request,
					id: action.payload.data.data,
					voucher_counts: request.voucher_counts,
					total_counts: request.voucher_counts,
				});
			});
	},
	reducers: {}
});

export const selectPromotions = (state) => state.promotion;
export default promotionSlice.reducer;