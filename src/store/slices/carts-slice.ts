import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';

const api = new Api();


export const getMyCart = createAsyncThunk(
	'carts/my-cart',
	async (params: QueryParamsType) => {
		const response = await api.category.getCategories(params);
		return response;
	}
);



export const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		data: [],
		count: 0,
		loading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createCartenticationToken.fulfilled, (_, action) => {
				localStorage.setItem('accessToken', action.payload.data.accessToken);
				localStorage.setItem('refreshToken', action.payload.data.refreshToken);
				localStorage.setItem('REACT_STARTER_AUTH', JSON.stringify({
					accessToken: action.payload.data.accessToken,
					isCartenticated: true,
				}));
			})
			.addCase(createCartenticationToken.rejected, (_, action) => {
				console.log(action.error);
			})
	},
	reducers: {

	}
});

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
