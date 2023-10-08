import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateUserAddressRequest } from '../../api/interface/user';

const api = new Api();

export const addMyAddress = createAsyncThunk(
  'users/add-my-address',
  async (input: CreateUserAddressRequest) => {
    const response = await api.users.addMyAddress(input);
    return response;
  }
);

export const getMyAddress = createAsyncThunk(
  'users/get-my-address',
  async (params: QueryParamsType) => {
    const response = await api.users.getMyAddress(params);
    return response;
  }
);

export const countMyAddress = createAsyncThunk(
  'users/count-my-address',
  async () => {
    const response = await api.users.countMyAddress();
    return response;
  }
);

export const getMyAddressById = createAsyncThunk(
  'users/get-my-address-by-id',
  async (id: string) => {
    const response = await api.users.getMyAddressById(id);
    return response;
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMyAddress.fulfilled, () => {
      })

  },
  reducers: {

  }
});

export const selectusers = (state) => state.users;

export default usersSlice.reducer;
