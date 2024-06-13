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