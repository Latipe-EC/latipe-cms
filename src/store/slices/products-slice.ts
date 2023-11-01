import { AttributeValue } from './../../api/interface/product';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { CreateProductRequest } from 'api/interface/product';

const api = new Api();
export const createProduct = createAsyncThunk(
	'products/login',
	async (input: CreateProductRequest) => {

		const listImage = [];
		if (input.imagesFile != null && input.imagesFile.length > 0) {
			for (let i = 0; i < input.imagesFile.length; i++) {
				const file = await api.media.uploadFile({ file: input.imagesFile[i] });
				listImage.push(file.data.url);
			}
		}
		input.imagesFile = null;
		input.images = listImage;

		if (input.productVariants.length > 0) {
			for (let i = 0; i < input.productVariants[0].optionSamples.length; i++) {
				const file = await api.media.uploadFile({ file: input.productVariants[0].optionSamples[i].file });
				input.productVariants[0].optionSamples[i].image = file.data.url;
				input.productVariants[0].optionSamples[i].file = null;
			}
		}

		for (let i = 0; i < input.productVariants.length; i++) {
			input.productVariants[i].options = input.productVariants[i].optionSamples.map(x => x.option)
			input.productVariants[i].optionSamples = null;
		}

		const response = await api.product.addProduct(input);
		return response;
	}
);


export const productsSlice = createSlice({
	name: 'products',
	initialState: {
		data: [],
		loading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createProduct.rejected, (_, action) => {
				console.log(action.error);
			})
	},
	reducers: {

	}
});

export const selectAuth = (state) => state.products;

export default productsSlice.reducer;
