import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateUserAddressRequest, UserAddress } from '../../api/interface/user';

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
export const usersSlice = createSlice({
	name: 'users',
	initialState: {
		dataAddress: [],
		paginationAddress: {
			total: 0,
			skip: 0,
			limit: 0,
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
				localStorage.setItem('user', JSON.stringify(action.payload.data));
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
			});
	},
	reducers: {

	}
});

export const selectusers = (state) => state.users;

export default usersSlice.reducer;
