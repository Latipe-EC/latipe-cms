import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CartItemRequest, DeleteCartItemRequest, UpdateQuantityRequest } from '@interfaces/cart';

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
	async (data: CartItemRequest) => {
		const response = await api.cart.addToCart(data);
		return response;
	}
);

export const
	updateQuantity = createAsyncThunk(
		'carts/quantity',
		async (data: UpdateQuantityRequest) => {
			const response = await api.cart.updateQuantity(data);
			return response;
		}
	);

export const
	getMultiCart = createAsyncThunk(
		'carts/multi-cart',
		async (params: QueryParamsType) => {
			const response = await api.cart.getMultiCart(params);
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
				if (action.payload.data.pagination.skip === 0) {
					state.data = action.payload.data.data;
				} else {
					state.data.push(...action.payload.data.data);
				}
				state.count = action.payload.data.pagination.total;
			})
			.addCase(deleteCartItem.fulfilled, (state, action) => {
				const deleteCartItemIds = action.meta.arg;
				deleteCartItemIds.ids.forEach(deleteCartItemId => {
					const index = state.data.findIndex((cartItem) => cartItem.id === deleteCartItemId);
					if (index !== -1) {
						state.data.splice(index, 1);
						state.pagination.total--;
						state.count--;
					}
				});
			})
			.addCase(updateQuantity.fulfilled, (state, action) => {
				const cartItem = action.meta.arg;
				const index = state.data.findIndex((item) => item.id === cartItem.id);
				state.data[index].quantity = cartItem.quantity;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.data.push(action.payload.data);
				state.pagination.total++;
			})
	},
	reducers: {
		incrementCount: (state) => {
			state.count++;
		},
		removeCartItem: (state, action: PayloadAction<string[]>) => {
			state.data = state.data.filter((item) => !action.payload.includes(item.id));
		},
	}
});

export const selectCart = (state) => state.cart;
export const { incrementCount } = cartSlice.actions;
export const { removeCartItem } = cartSlice.actions;
export default cartSlice.reducer;

