export interface ApplyVoucherRequest {
	vouchers: string[]
}

export interface createVoucherRequest {
	voucher_code: string
	voucher_type: number
	voucher_counts: number
	detail: string
	discount_percent: number
	discount_value: number
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
	is_success: boolean
	items: ItemVoucher[]
}


export interface ApplyVoucherReponse {
	is_success: boolean
	items: ItemVoucher[]
}

export interface ItemVoucher {
	_id: string
	voucher_code: string
	voucher_type: number
	voucher_counts: number
	discount_percent: number
	detail: string
	discount_value: number
	voucher_require: VoucherRequire
	created_at: string
	updated_at: string
	stated_time: string
	ended_time: string
	status: number
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
}
