import { FaMoneyBillWave, FaPaypal, FaWallet } from "react-icons/fa";


export const deviceSize = {
	xs: 425,
	sm: 768,
	md: 1024,
	lg: 1440,
};

export const layoutConstant = {
	grocerySidenavWidth: "280px",
	containerWidth: "1200px",
	mobileNavHeight: "64px",
	headerHeight: "80px",
	mobileHeaderHeight: "64px",
};


export const DiscountType = {
	FIXED_DISCOUNT: 0,
	PERCENT_DISCOUNT: 1,
};

export const VoucherType = {
	DELIVERY: 1,
	PRODUCT: 2,
};

export const PaymentMethodName = {
	COD: 'COD',
	PayPal: 'PayPal',
	Wallet: 'Wallet',
};

export const paymentMethodList = [
	{ name: PaymentMethodName.COD, icon: FaMoneyBillWave, color: "#a0a832" },
	{ name: PaymentMethodName.PayPal, icon: FaPaypal, color: "#3265a8" },
	{ name: PaymentMethodName.Wallet, icon: FaWallet, color: "#32a86d" },
];

export const ErrorMessage = {
	VOUCHER_USED: 'Voucher đã được áp dụng',
	VOUCHER_EXPIRED: 'Voucher đã hết hạn',
	VOUCHER_NOT_EXIST: 'Voucher không tồn tại',
	INVALID_VOUCHER: 'Voucher không hợp lệ',
	VOUCHER_REQUIRE_NOT_MET: 'Voucher không đủ điều kiện',
	ORDER_FAILED: 'Đặt hàng thất bại',
};

export const TitleAlter = {
	WARNING_TITLE: 'Cảnh báo',
};

export const ContentAlter = {
	VOUCHER_CHANGED_BY_CHANGE_METHOD_PAYMENT: 'Voucher đã được thay đổi do bạn đã thay đổi phương thức thanh toán',
};

