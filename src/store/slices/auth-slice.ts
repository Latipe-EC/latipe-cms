import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import {
	FinishVerifyAccountRequest,
	ForgotPasswordRequest,
	LoginRequest,
	RegisterAccountRequest,
	ResetPasswordRequest,
	VerifyAccountRequest
} from '../../api/interface/auth';

const api = new Api();
export const createAuthenticationToken = createAsyncThunk(
	'auth/login',
	async (input: LoginRequest) => {
		const response = await api.auth.createAuthenticationToken(input);
		return response;
	}
);

export const resetPassword = createAsyncThunk(
	'auth/resetPassword',
	async (request: ResetPasswordRequest) => {
		const response = await api.auth.resetPassword(request);
		return response;
	}
);

export const forgotPassword = createAsyncThunk(
	'auth/forgotPassword',
	async (request: ForgotPasswordRequest) => {
		const response = await api.auth.forgotPassword(request);
		return response;
	}
);

export const registerAccount = createAsyncThunk(
	'auth/registerAccount',
	async (request: RegisterAccountRequest) => {
		const response = await api.auth.registerAccount(request);
		return response;
	}
);

export const finishVerifyAccount = createAsyncThunk(
	'auth/finishVerifyAccount',
	async (request: FinishVerifyAccountRequest) => {
		const response = await api.auth.finishVerifyAccount(request);
		return response;
	}
);

export const verifyAccount = createAsyncThunk(
	'auth/verifyAccount',
	async (request: VerifyAccountRequest) => {
		const response = await api.auth.verifyAccount(request);
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
				if (action.payload.status !== 200) {
					localStorage.clear();
					return;
				}
				localStorage.setItem('accessToken', action.payload.data.accessToken);
				localStorage.setItem('refreshToken', action.payload.data.refreshToken);
				localStorage.setItem('REACT_STARTER_AUTH', JSON.stringify({
					accessToken: action.payload.data.accessToken,
					isAuthenticated: true,
					role: action.payload.data.role,
				}));
			})
			.addCase(createAuthenticationToken.rejected, (_, action) => {
				console.log(action.error);
			})
	},
	reducers: {}
});

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
