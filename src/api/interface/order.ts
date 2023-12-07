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

export interface CountMyOrderResponse {
	code: number
	error_code: string
	message: string
	data: CountMyOrder
}

export interface CountMyOrder {
	count: number
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
	item_discount: number
	shipping_discount: number
	sub_total: number
	status: number
	payment_method: number
	created_at: string
	updated_at: string
	delivery: DeliveryGetOrderById
	order_items: OrderItem[]
	order_status: StatusOrder[],
}

export interface DeliveryGetOrderById {
	delivery_id: string
	delivery_name: string
	cost: number
	receiving_date: string
	address_id: string
	shipping_name: string
	shipping_phone: string
	shipping_address: string
}

export interface OrderItem {
	product_id: string
	sub_total: number
	option_id: string
	quantity: number
	product_name: string
	image: string
	store_id: string
	price: number
	rating_id: string
	name_option: string
	item_id: string
}

export interface StatusOrder {
	message: string
	status_change: number
	created_at: string
}

export interface GetMyOrderResponse {
	code: number
	error_code: string
	message: string
	data: DataGMO
}

export interface DataGMO {
	items: DaumGMO[]
	total: number
	page: number
	size: number
	has_more: boolean
}

export interface DaumGMO {
	order_uuid: string
	amount: number
	shipping_discount: number
	item_discount: number
	sub_total: number
	status: number
	payment_method: number
	created_at: string
	updated_at: string
	delivery: Delivery
}

export interface DeliveryGMO {
	delivery_id: string
	delivery_name: string
	cost: number
	receiving_date: string
	address_id: string
	shipping_name: string
	shipping_phone: string
	shipping_address: string
}
