
export interface listDeliveryRequest {
	src_code: string[],
	dest_code: string,
}

export interface calculateShippingOrderRequest {
	src_code: string[],
	dest_code: string,
	delivery_id: string,
}

export interface createDeliveryRequest {
	delivery_name: string
	delivery_code: string
	base_cost: number
	description: string
	email: string
	phone_number: string
}
