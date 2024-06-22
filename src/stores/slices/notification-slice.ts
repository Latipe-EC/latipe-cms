import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Api, QueryParamsType } from '../../api/AxiosClient';
import {
	CreateCampaignRequest,
	RecallCampaignRequest
} from '@interfaces/notification';

const api = new Api();

export const createCampaign = createAsyncThunk(
	'notifications/createCampaign',
	async (request: { data: CreateCampaignRequest, file: File }) => {
		if (request.file) {
			const file = await api.media.uploadFile({ file: request.file });
			if (file.status !== 201)
				throw new Error("Some thing went wrong");
			request.data.image = file.data.url;
		}
		const response = await api.notification.createCampaign(request.data);
		return response;
	}
);

export const recallCampaign = createAsyncThunk(
	'notifications/recallCampaign',
	async (request: RecallCampaignRequest) => {
		const response = await api.notification.recallCampaign(request);
		return response;
	}
);

export const getCampaignAdmin = createAsyncThunk(
	'notifications/getCampaignAdmin',
	async (params: QueryParamsType) => {
		const response = await api.notification.getCampaignAdmin(params);
		return response;
	}
);

export const getNotificationCount = createAsyncThunk(
	'notifications/getNotificationCount',
	async () => {
		const response = await api.notification.getNotificationCount();
		return response;
	}
);

export const markAllRead = createAsyncThunk(
	'notifications/markAllRead',
	async () => {
		const response = await api.notification.markAllRead();
		return response;
	}
);

export const getNotifications = createAsyncThunk(
	'notifications/getNotifications',
	async (params: QueryParamsType) => {
		const response = await api.notification.getNotifications(params);
		return response;
	}
);

export const getNotificationDetail = createAsyncThunk(
	'notifications/getNotificationDetail',
	async (id: string) => {
		const response = await api.notification.getNotificationDetail(id);
		return response;
	}
);

export const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: {
		notification: null,
		notifications: [],
		total: 0,
		page: 0,
		size: 0,
		has_more: false,
		isLoading: false,
		error: null,
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCampaignAdmin.fulfilled, (state, action) => {
				if (action.payload.data.code !== 200) {
					state.notifications = [];
					state.total = 0;
					state.page = 0;
					state.size = 0;
					state.has_more = false;
					return;
				}
				state.isLoading = false;
				state.notifications = action.payload.data.data.items;
				state.total = action.payload.data.data.total;
				state.page = action.payload.data.data.page;
				state.size = action.payload.data.data.size;
				state.has_more = action.payload.data.data.has_more;
			})
			.addCase(createCampaign.fulfilled, (state, action) => {
				if (action.payload.data.code !== 200) {
					return;
				}
				state.notifications.push(action.payload.data);
				state.total += 1;
				state.page = Math.ceil(state.total / state.size);
			}).addCase(recallCampaign.fulfilled, (state, action) => {
				if (action.payload.status !== 200) {
					return;
				}
				const index = state.notifications.findIndex(x => x.id === JSON.parse(action.payload.config.data).id);
				state.notifications[index].is_active = false;
				state.notifications[index].updated_at = new Date().toISOString();
				state.notifications[index].recall_reason = JSON.parse(action.payload.config.data).recall_reason
			})
	},
	reducers: {}
});

export const selectNotifications = (state) => state.notifications;

export default notificationsSlice.reducer;
