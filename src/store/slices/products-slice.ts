import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../api/AxiosClient';
import { CreateProductRequest, ProductFeatureRequest, UpdateProductRequest } from 'api/interface/product';

const api = new Api();

export const createProduct = createAsyncThunk(
	'products/create',
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
			for (let i = 0; i < input.productVariants[0].options.length; i++) {
				const file = await api.media.uploadFile({ file: input.productVariants[0].options[i].file });
				input.productVariants[0].options[i].image = file.data.url;
				input.productVariants[0].options[i].file = null;
			}
		}
		console.log(input);
		const response = await api.product.addProduct(input);
		return response;
	}
);

export const updateProduct = createAsyncThunk(
	'products/update',
	async (input: UpdateProductRequest) => {

		const listImage = [];
		const newImage = input.imagesFile.filter((image) => {
			if (input.originalFiles.map(x => x.file).includes(image)) {
				return false;
			}
			return true;
		})

		if (newImage != null && newImage.length > 0) {
			for (let i = 0; i < newImage.length; i++) {
				const file = await api.media.uploadFile({ file: newImage[i] });
				listImage.push(file.data.url);
			}
		}

		input.images = [];
		input.imagesFile.filter((image) => {
			const index = input.originalFiles.findIndex(x => x.file === image)
			if (index > -1) {
				input.images.push(input.originalFiles[index].url)
				return false;
			}
			input.images.push(listImage.shift())
			return true;
		})
		input.imagesFile = null
		if (input.productVariants.length > 0) {
			for (let i = 0; i < input.productVariants[0].options.length; i++) {
				if (!input.originalFiles.map(x => x.file).includes(input.productVariants[0].options[i].file)) {
					const file = await api.media.uploadFile({ file: input.productVariants[0].options[i].file });
					input.productVariants[0].options[i].image = file.data.url;
				}
				input.productVariants[0].options[i].file = null;
			}
		}

		const response = await api.product.updateProduct(input);
		return response;
	}
);

export const getProductById = createAsyncThunk(
	'products/:id',
	async (id: string) => {
		const response = await api.product.getProductById(id);
		return response;
	}
);

export const getFeatureProduct = createAsyncThunk(
	'products/list-feature',
	async (request: ProductFeatureRequest[]) => {
		const response = await api.product.getFeatureProduct(request);
		return response;
	}
);

export const productsSlice = createSlice({
	name: 'products',
	initialState: {
		data: [],
		loading: false,
		error: null,
		product: null
	},
	extraReducers: (builder) => {
		builder
			.addCase(createProduct.rejected, (_, action) => {
				console.log(action.error);
			})
		builder
			.addCase(getProductById.fulfilled, (state, action) => {
				state.product = action.payload.data;
			})
	},
	reducers: {

	}
});

export const selectProduct = (state) => state.products;

export default productsSlice.reducer;
