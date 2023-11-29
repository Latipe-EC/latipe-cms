export interface CreateOrderRequest {
	payment_method: number
	vouchers?: string[]
	address: Address
	order_items: OrderItem[]
	delivery: Delivery
}


export interface CancelOrderRequest {
	order_uuid: string
}


export interface Address {
	address_id: string
}

export interface OrderItem {
	cart_id: string
	product_id: string
	option_id: string
	quantity: number
}

export interface Delivery {
	delivery_id: string
}

