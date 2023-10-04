import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { LoginRequest } from '../../api/Interface';

const api = new Api();
export const createAuthenticationToken = createAsyncThunk(
  'auth/login',
  async (input: LoginRequest) => {
    const response = await api.auth.createAuthenticationToken(input);
    return response;
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAuthenticationToken.fulfilled, (_, action) => {
        localStorage.setItem('accessToken', action.payload.data.accessToken);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
        localStorage.setItem('REACT_STARTER_AUTH', JSON.stringify({
          accessToken: action.payload.data.accessToken,
          isAuthenticated: true,
        }));
      })
      .addCase(createAuthenticationToken.rejected, (_, action) => {
        console.log(action.error);
      })
  },
  reducers: {

  }
});

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
