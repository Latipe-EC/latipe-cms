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


export interface CreateOrderResponse {
	code: number
	error_code: string
	message: string
	data: Data
}

export interface Data {
	user_order: UserOrder
	order_key: string
	amount: number
	discount: number
	sub_total: number
	payment_method: number
}

export interface UserOrder {
	user_id: string
	username: string
}


export interface GetOrderByIdResponse {
	code: number
	error_code: string
	message: string
	data: DataGetOrderById
}

export interface DataGetOrderById {
	order: Order
}

export interface Order {
	order_uuid: string
	amount: number
	discount: number
	sub_total: number
	status: number
	payment_method: number
	created_at: string
	"updated-at": string
	delivery: DeliveryGetOrderById
}

export interface DeliveryGetOrderById {
	delivery_id: string
	delivery_name: string
	payment_type: number
	receiving_date: string
	address_id: string
	shipping_name: string
	shipping_phone: string
	shipping_address: string
}
