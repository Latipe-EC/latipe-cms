export interface CheckPaymentOrderResponse {
	checkoutId: string;
	amount: number;
	paymentFee: number;
	paymentMethod: EPaymentMethod;
	paymentStatus: EPaymentStatus;
}

export enum EPaymentMethod {
	COD = "COD",
	BANKING = "BANKING",
	PAYPAL = "PAYPAL"
}

export enum EPaymentStatus {
	PENDING = "PENDING",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED"
}

export interface PayOrderRequest {
	orderId: string
}

export interface PayByPaypalRequest {
	orderId: string,
	id: string,
	status: string,
	email: string,
}

export interface CapturePayment {
	id: string
	intent: string
	status: string
	purchase_units: PurchaseUnit[]
	payer: Payer
	create_time: string
	update_time: string
	links: Link[]
}

export interface PurchaseUnit {
	reference_id: string
	amount: Amount
	payee: Payee
	shipping: Shipping
	payments: Payments
}

export interface Amount {
	currency_code: string
	value: string
}

export interface Payee {
	email_address: string
	merchant_id: string
}

export interface Shipping {
	name: Name
	address: Address
}

export interface Name {
	full_name: string
}

export interface Address {
	address_line_1: string
	admin_area_2: string
	admin_area_1: string
	postal_code: string
	country_code: string
}

export interface Payments {
	captures: Capture[]
}

export interface Capture {
	id: string
	status: string
	amount: Amount2
	final_capture: boolean
	seller_protection: SellerProtection
	create_time: string
	update_time: string
}

export interface Amount2 {
	currency_code: string
	value: string
}

export interface SellerProtection {
	status: string
	dispute_categories: string[]
}

export interface Payer {
	name: Name2
	email_address: string
	payer_id: string
	address: Address2
}

export interface Name2 {
	given_name: string
	surname: string
}

export interface Address2 {
	country_code: string
}

export interface Link {
	href: string
	rel: string
	method: string
}

export interface withdrawPayPalRequest {
	email: string
	amount: number
}

export interface validWithdrawPayPalRequest {
	token: string
}

export interface PaymentResponse {
	orderId: string;
	checkoutId: string;
	amount: number;
	paymentFee: number;
	gatewayTransactionId: string;
	paymentMethod: EPaymentMethod;
	paymentStatus: EPaymentStatus;
	failureMessage: string;
}

