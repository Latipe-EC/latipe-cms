import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Api, QueryParamsType} from '../../api/AxiosClient';
import {ApplyVoucherRequest, createVoucherRequest} from 'api/interface/promotion';

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
    getAll = createAsyncThunk(
        'promotions/getAll',
        async (params: QueryParamsType) => {
          const response = await api.promotion.getAll(params);
          return response;
        }
    );

export const
    checkVoucher = createAsyncThunk(
        'promotions/checkVoucher',
        async (request: ApplyVoucherRequest) => {
          const response = await api.promotion.checkVoucher(request);
          return response;
        }
    );


export const promotionSlice = createSlice({
  name: 'promotion',
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
  reducers: {}
});

export const selectPromotions = (state) => state.promotion;
