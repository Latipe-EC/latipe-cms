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
	is_prepared: number
	net_price: number
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

export interface searchStoreOrderResponse {
	code: number
	error_code: string
	message: string
	data: DataSearchStoreOrder
}

export interface DataSearchStoreOrder {
	items: ItemSearchStoreOrder[]
	total: number
	page: number
	size: number
	has_more: boolean
}

export interface ItemSearchStoreOrder {
	order_uuid: string
	status: number
	payment_method: number
	created_at: string
	updated_at: string
	is_prepared: number
	delivery: Delivery
}

export interface StoreOrderDetailResponse {
	code: number
	error_code: string
	message: string

	data: DataStoreOrderDetail
}

export interface DataStoreOrderDetail {
	order_uuid: string
	store_order_amount: number
	status: number
	payment_method: number
	created_at: string
	updated_at: string
	delivery: DeliveryGetOrderById
	commission_detail: CommissionDetail
	order_items: OrderItem[]
}

export interface GetTotalOrderInMonthResponse {
	code: number
	error_code: string
	message: string
	data: GetTotalOrderInMonthData
}

export interface GetTotalOrderInMonthData {
	filter_date: string
	items: ItemGetTotalOrderInMonth[]
}

export interface UpdateOrderItemStatusByStoreResponse {
	code: number
	error_code: string
	message: string
}

export interface ItemGetTotalOrderInMonth {
	day: number
	amount: number
	count: number
}

export interface GetTotalOrderInYear {
	code: number
	error_code: string
	message: string
	data: DataGetTotalOrderInYear
}

export interface DataGetTotalOrderInYear {
	items: ItemGetTotalOrderInYear[]
}

export interface ItemGetTotalOrderInYear {
	month: number
	amount: number
	count: number
}

export interface GetTotalCommissionResponse {
	code: number
	error_code: string
	message: string
	data: DataGetTotalCommission
}

export interface DataGetTotalCommission {
	filter_date: string
	items: ItemGetTotalCommission[]
}

export interface ItemGetTotalCommission {
	month: number
	total_received: number
	total_fee: number
	total_orders: number
}

export interface GetProductBestSellerResponse {
	code: number
	error_code: string
	message: string
	data: DataGetProductBestSeller
}

export interface DataGetProductBestSeller {
	filter_date: string
	items: ItemGetProductBestSeller[]
}

export interface ItemGetProductBestSeller {
	product_id: string
	product_name: string
	total: number
}


export interface StatusParamRequest {
	params: {
		item_id: string
	},
	id: string
}


export interface StatusBodyRequest {
	body: {
		item_id: string
	},
	id: string
}

export interface CommissionDetail {
	amount_received: number
	system_fee: number
}