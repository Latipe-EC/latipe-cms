
export interface ListDeliveryRequest {
	src_code: string[],
	dest_code: string,
}

export interface CalculateShippingOrderRequest {
	src_code: string[],
	dest_code: string,
	delivery_id: string,
}

export interface CreateDeliveryRequest {
	delivery_name: string
	delivery_code: string
	base_cost: number
	description: string
	email: string
	phone_number: string
}

export interface CostDelivery {
	src_code: string[]
	dest_code: string
	receive_date: string
	delivery_id: string
	delivery_name: string
	cost: number
}

export interface DeliveryResponse {
	_id: string
	delivery_name: string
	delivery_code: string
	base_cost: number
	description: string
	created_at?: string
	updated_at?: string
	is_active: boolean
}

export interface UpateDeliveryRequest {
	id: string
	delivery_name: string
	delivery_code: string
	base_cost: number
	description: string
}
