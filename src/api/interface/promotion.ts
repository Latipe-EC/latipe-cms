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
