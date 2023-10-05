import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { CreateUserAddressRequest } from 'api/Interface';

const api = new Api();
export const addMyAddress = createAsyncThunk(
  'users/my-address',
  async (input: CreateUserAddressRequest) => {
    const response = await api.users.addMyAddress(input);
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
