export interface ApplyVoucherRequest {
	vouchers: string[]
}

export interface createVoucherRequest {
	voucher_code: string
	voucher_type: number
	voucher_counts: number
	detail: string
	discount_data: DiscountData
	voucher_require: VoucherRequire
	stated_time: string
	ended_time: string
}

export interface VoucherRequire {
	min_require: number
}

export interface UpdateStatusVoucher {
	code: string
	status: number
}

export interface CheckVoucherReponse {
	"code": number,
	"message": string,
	data: CheckVoucherData
}

export interface ApplyVoucherRequest {
	order_total_amount: number
	payment_method: number
	user_id: string
	vouchers: string[]
}

export interface CheckVoucherData {
	items: ItemVoucher[]
}


export interface ApplyVoucherReponse {
	is_success: boolean
	items: ItemVoucher[]
}

export interface ItemVoucher {
	id: string
	voucher_code: string
	voucher_type: number
	voucher_counts: number
	detail: string
	owner_voucher?: string
	status: number
	discount_data: DiscountData
	voucher_require: VoucherRequire
	stated_time: string
	ended_time: string
	created_at: string
	updated_at: string
	count_usable?: number
	real_discount?: RealDiscount
}

export interface RealDiscount {
	totalPrice: number
	deliveries: string[]
}
export interface DiscountData {
	discount_type: number
	discount_percent?: number
	maximum_value?: number
	discount_value?: number
	shipping_value?: number
}

export interface ListVoucherReponse {
	code: number
	message: string
	data: ListVoucherData
}

export interface ListVoucherData {
	items: ItemVoucher[]
	total: number
	page: number
	size: number
	has_more: boolean
}

export interface VoucherRequire {
	min_require: number
	payment_method?: number
	max_voucher_per_user: number
}

export interface CheckingVoucherRequest {
	vouchers: string[]
}
