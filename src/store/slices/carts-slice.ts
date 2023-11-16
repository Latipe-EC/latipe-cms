import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CartItemRequest, DeleteCartItemRequest, UpdateQuantityRequest } from 'api/interface/cart';

const api = new Api();


export const getMyCart = createAsyncThunk(
	'carts/my-cart',
	async (params: QueryParamsType) => {
		const response = await api.cart.getMyCart(params);
		return response;
	}
);

export const addToCart = createAsyncThunk(
	'carts/addToCart',
	async (data: Array<CartItemRequest>) => {
		const response = await api.cart.addToCart(data);
		return response;
	}
);

export const
	updateQuantity = createAsyncThunk(
		'carts/update-quantity',
		async (data: UpdateQuantityRequest) => {
			const response = await api.cart.updateQuantity(data);
			return response;
		}
	);

export const
	deleteCartItem = createAsyncThunk(
		'carts/delete-cart-item',
		async (data: DeleteCartItemRequest) => {
			const response = await api.cart.deleteCartItem(data);
			return response;
		}
	);

export const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		data: [],
		pagination: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		count: 0,
		loading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getMyCart.fulfilled, (state, action) => {
				state.pagination.total = action.payload.data.pagination.total;
				state.pagination.skip = action.payload.data.pagination.skip;
				state.pagination.limit = action.payload.data.pagination.limit;
				state.data = action.payload.data.data;
			})
			.addCase(deleteCartItem.fulfilled, (state, action) => {
				const deleteCartItemId = action.meta.arg;
				const inedx = state.data.findIndex((cartItem) => cartItem.id === deleteCartItemId);
				if (inedx !== -1) {
					state.data.splice(inedx, 1);
				}
			})
			.addCase(updateQuantity.fulfilled, (state, action) => {
				const deleteCartItemId = action.meta.arg;
				const index = state.data.findIndex((category) => category.id === deleteCartItemId);
				state.data[index].quantity++;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.count = state.count + 1;
				state.data.push(action.payload.data);
			})
	},
	reducers: {

	}
});

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
