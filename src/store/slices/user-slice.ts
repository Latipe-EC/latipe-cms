import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateUserAddressRequest, UpdateBanUserRequest, UpdateUserRequest, UpdateUsernameRequest, UserAddress } from '../../api/interface/user';

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

export const updateMyAddress = createAsyncThunk(
	'users/update-my-address',
	async (address: UserAddress) => {
		const response = await api.users.updateMyAddress(address.id, address);
		return response;
	}
);

export const updateProfile = createAsyncThunk(
	'users/updateProfile',
	async (request: UpdateUserRequest) => {
		if (request.avatarFile) {
			const file = await api.media.uploadFile({ file: request.avatarFile });
			if (file.status !== 201)
				throw new Error("Some thing went wrong");
			request.avatar = file.data.url;
		}
		request.gender = request.gender.toUpperCase();
		const response = await api.users.updateProfile(request);
		return response;
	}
);

export const updateUsername = createAsyncThunk(
	'users/updateUsername',
	async (request: UpdateUsernameRequest) => {
		const response = await api.users.updateUsername(request);
		return response;
	}
);

export const deleteMyAddress = createAsyncThunk(
	'users/delete-my-address',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await api.users.deleteMyAddress(id);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getMyProfile = createAsyncThunk(
	'users/my-profile',
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.users.getMyProfile();
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const getAdminUser = createAsyncThunk(
	'users/getAdminUser',
	async (params: QueryParamsType, { rejectWithValue }) => {
		try {
			const response = await api.users.getAdminUser(params);
			return response;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const updateBanUser = createAsyncThunk(
	'Users/updateBanUser',
	async (request: UpdateBanUserRequest) => {
		const response = await api.users.updateBanUser(request);
		return response;
	}
);


export const usersSlice = createSlice({
	name: 'users',
	initialState: {
		dataAddress: [],
		paginationAddress: {
			total: 0,
			skip: 0,
			limit: 0,
		},
		data: [],
		pagination: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		countAddress: 0,
		isLoading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(addMyAddress.fulfilled, (state, action) => {
				state.paginationAddress.total += 1;
				state.countAddress += 1;
				state.dataAddress.push(action.payload.data);
			})
			.addCase(getMyProfile.fulfilled, (_, action) => {
				localStorage.setItem('REACT_STARTER_AUTH', JSON.stringify({
					...action.payload.data,
					addresses: null
				}));
			})
			.addCase(getMyAddress.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(getMyAddress.fulfilled, (state, action) => {
				state.isLoading = false;
				state.dataAddress = action.payload.data.data;
				state.paginationAddress.total = action.payload.data.pagination.total;
				state.paginationAddress.skip = action.payload.data.pagination.skip;
				state.paginationAddress.limit = action.payload.data.pagination.limit;
			})
			.addCase(deleteMyAddress.fulfilled, (state, action) => {
				state.paginationAddress.total -= 1;
				state.countAddress -= 1;
				const deletedAddressId = action.meta.arg;
				const deletedAddressIndex = state.dataAddress.findIndex((address) => address.id === deletedAddressId);
				if (deletedAddressIndex !== -1) {
					state.dataAddress.splice(deletedAddressIndex, 1);
				}
			})
			.addCase(countMyAddress.fulfilled, (state, action) => {
				state.countAddress = action.payload.data;
			})
			.addCase(updateMyAddress.fulfilled, (state, action) => {
				const updatedAddress = action.payload.data;
				const updatedAddressIndex = state.dataAddress.findIndex((address) => address.id === updatedAddress.id);
				if (updatedAddressIndex !== -1) {
					state.dataAddress[updatedAddressIndex] = updatedAddress;
				}
			}).addCase(getAdminUser.fulfilled, (state, action) => {
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
			.addCase(getAdminUser.rejected, (state) => {
				state.data = [];
				state.pagination = {
					total: 0,
					skip: 0,
					limit: 10,
				}
			})
			.addCase(updateBanUser.fulfilled, (state, action) => {
				const index = state.data.findIndex(x => x.id === JSON.parse(action.payload.config.data).id);
				const isBanned = JSON.parse(action.payload.config.data).isBanned;
				state.data[index].isBanned = isBanned;
				console.log(action.payload.config.data);
				if (isBanned)
					state.data[index].reasonBan = JSON.parse(action.payload.config.data).reason;
				else
					state.data[index].reasonBan = null;
			});
	},
	reducers: {

	}
});

export const selectusers = (state) => state.users;

export default usersSlice.reducer;
