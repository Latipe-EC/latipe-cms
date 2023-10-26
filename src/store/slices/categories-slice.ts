import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import { CreateCategoryRequest, UpdateCategoryRequest } from 'api/interface/product';

const api = new Api();

export const fetchCategories = createAsyncThunk(
	'categories/fetchCategories',
	async (params: QueryParamsType) => {
		const response = await api.category.getCategories(params);
		return response;
	}
);

export const addCategory = createAsyncThunk('categories/addCategory', async (category: CreateCategoryRequest) => {
	if (category.file !== null) {
		const file = await api.media.uploadFile({ file: category.file });
		category.image = file.data.url;
		category.file = null;
	}
	const response = await api.category.addCategory(category);
	return response;
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id: string) => {
	await api.category.deleteCategory(id);
	return id;
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async (category: UpdateCategoryRequest) => {
	if (category.file !== null) {
		const file = await api.media.uploadFile({ file: category.file });
		category.image = file.data.url;
	}
	const response = await api.category.updateCategory(category);
	return response;
});

export const getCategory = createAsyncThunk('categories/getCategory', async (id: string) => {
	const response = await api.category.getCategory(id);
	return response;
});

export const getChildsCategory = createAsyncThunk('categories/getChildsCategory', async (parentId: string) => {
	const response = await api.category.getChildCategories(parentId);
	return response;
});


export const categoriesSlice = createSlice({
	name: 'categories',
	initialState: {
		category: null,
		data: [],
		children: [],
		list: [],
		pagination: {
			total: 0,
			skip: 0,
			limit: 10,
		},
		isLoading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.data = action.payload.data.data;
				state.pagination.total = action.payload.data.pagination.total;
				state.pagination.skip = action.payload.data.pagination.skip;
				state.pagination.limit = action.payload.data.pagination.limit;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			})
			.addCase(addCategory.fulfilled, (state, action) => {
				state.data.push(action.payload.data);
				state.list.push(action.payload.data);
			})
			.addCase(getChildsCategory.fulfilled, (state, action) => {
				state.children = action.payload.data;
			})
			.addCase(getCategory.fulfilled, (state, action) => {
				state.category = action.payload.data;
			})
			.addCase(deleteCategory.fulfilled, (state, action) => {
				const deletedCateId = action.meta.arg;
				const inedx = state.data.findIndex((category) => category.id === deletedCateId);
				if (inedx !== -1) {
					state.data.splice(inedx, 1);
				}
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				const updatedCate = action.payload.data;
				const index = state.data.findIndex((category) => category.id === updatedCate.id);
				state.data[index] = action.payload.data;
			})
	},
	reducers: {

	}
});

export const selectCategories = (state) => state.categories;

export default categoriesSlice.reducer;
