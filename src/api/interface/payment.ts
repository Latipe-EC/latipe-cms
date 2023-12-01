
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

