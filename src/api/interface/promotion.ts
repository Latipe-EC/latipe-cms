import { ApplyVoucherRequest } from 'api/interface/promotion';
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


export interface ApplyVoucherReponse {
	is_success: boolean
	items: Item[]
}

export interface Item {
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

