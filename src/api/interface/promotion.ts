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
	min_require?: number | string
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

export interface TotalAmountReponse {
	amount: number,
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
	total_counts?: number
}

export interface CreateVoucherResponse {
	code: number,
	message: string,
	data: string
}

export interface RealDiscount {
	totalPrice: number
	deliveries: string[]
}
export interface DiscountData {
	discount_type: number
	discount_percent?: number
	maximum_value?: number | string
	discount_value?: number | string
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
	min_require?: number | string
	payment_method?: number
	max_voucher_per_user: number
}

export interface CheckingVoucherRequest {
	vouchers: string[]
}
