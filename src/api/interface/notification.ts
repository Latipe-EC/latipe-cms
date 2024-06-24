export interface NewDeviceRequest {
	"device_info": string,
	"device_token": string,
	"device_type": number
}

export interface NewDeviceResponse {
	code: number
	message: string
	data: {
		id: string
	}
}

export interface CreateCampaignRequest {
	campaign_topic: string
	title: string
	body: string
	image: string
	schedule_display: string
}

export interface RecallCampaignRequest {
	notification_id: string
	reason: string
}

export interface GeneralCampaignAdminResponse<T = unknown> {
	code: number
	message: string
	data?: T
}

export interface CountNotificationUser {
	total: number
}

export interface ListCampaignDetail {
	items: CampaignDetail[]
	total: number,
	page: number,
	size: number,
	has_more: boolean
}

export interface CampaignDetail {
	id: string
	owner_id: string
	title: string
	image: string
	body: string
	type: number
	recall_reason?: string
	unread: boolean
	created_at: string
	updated_at: string
}

export interface CreateCapaign {
	id: string
}