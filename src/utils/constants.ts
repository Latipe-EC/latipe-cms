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

export enum TitleToast {
	SUCCESS = 'Thành công!',
	ERROR = 'Lỗi!',
	UPDATE_PRODUCT = 'Cập nhật sản phẩm',
	DELETE_PRODUCT = 'Xóa sản phẩm',
	ADD_PRODUCT = 'Thêm sản phẩm',
	ADD_CATEGORY = 'Thêm danh mục',
	DELETE_CATEGORY = 'Xóa danh mục',
	UPDATE_CATEGORY = 'Cập nhật danh mục',
	ADD_COMMISSION = 'Thêm hoa hồng',
	UPDATE_COMMISSION = 'Cập nhật hoa hồng',
	DELETE_COMMISSION = 'Xóa hoa hồng',
	ADD_TO_CART = 'Thêm vào giỏ hàng',
	ADD_VOUCHER = 'Thêm voucher',
	LOGIN = 'Đăng nhập',
	ADD_CAMPAIGN = 'Thêm chiến dịch',
}

export enum ContentToast {
	UPDATE_PRODUCT_SUCCESS = 'Cập nhật sản phẩm thành công',
	UPDATE_PRODUCT_ERROR = 'Cập nhật sản phẩm thất bại',
	DELETE_PRODUCT_SUCCESS = 'Xóa sản phẩm thành công',
	DELETE_PRODUCT_ERROR = 'Xóa sản phẩm thất bại',
	ADD_PRODUCT_SUCCESS = 'Thêm sản phẩm thành công',
	ADD_PRODUCT_ERROR = 'Thêm sản phẩm thất bại',
	ADD_CATEGORY_SUCCESS = 'Thêm danh mục thành công',
	ADD_CATEGORY_ERROR = 'Thêm danh mục thất bại',
	DELETE_CATEGORY_SUCCESS = 'Xóa danh mục thành công',
	DELETE_CATEGORY_ERROR = 'Xóa danh mục thất bại',
	UPDATE_CATEGORY_SUCCESS = 'Cập nhật danh mục thành công',
	UPDATE_CATEGORY_ERROR = 'Cập nhật danh mục thất bại',
	ADD_COMMISSION_SUCCESS = 'Thêm hoa hồng thành công',
	ADD_COMMISSION_ERROR = 'Thêm hoa hồng thất bại',
	UPDATE_COMMISSION_SUCCESS = 'Cập nhật hoa hồng thành công',
	UPDATE_COMMISSION_ERROR = 'Cập nhật hoa hồng thất bại',
	DELETE_COMMISSION_SUCCESS = 'Xóa hoa hồng thành công',
	DELETE_COMMISSION_ERROR = 'Xóa hoa hồng thất bại',
	ADD_TO_CART_SUCCESS = 'Thêm vào giỏ hàng thành công',
	ADD_TO_CART_ERROR = 'Thêm vào giỏ hàng thất bại',
	ADD_VOUCHER_SUCCESS = 'Thêm voucher thành công',
	ADD_VOUCHER_ERROR = 'Thêm voucher thất bại',
	LOGIN_SUCCESS = 'Đăng nhập thành công',
	LOGIN_ERROR = 'Đăng nhập thất bại',
	ADD_CAMPAIGN_SUCCESS = 'Thêm chiến dịch thành công',
	ADD_CAMPAIGN_ERROR = 'Thêm chiến dịch thất bại',
}

export enum ToastStatus {
	LOADING = "loading",
	ERROR = "error",
	INFO = "info",
	WARNING = "warning",
	SUCCESS = "success"
}

export const Path = {
	VENDOR_PRODUCT: '/vendor/products'
}

export enum Action {
	EDIT = 'Chỉnh sửa',
	DELETE = 'Xóa',
	ADD = 'Thêm',
	BACK = 'Quay lại',
	CONFIRM = 'Xác nhận',
	CANCEL_ORDER = 'Hủy đơn hàng',
	CANCEL = 'Hủy',
	CLOSE = 'Đóng',
	SAVE = 'Lưu',
	VIEW_DETAIL = 'Xem chi tiết',
	VIEW = 'Xem',
	RETURN_ORDER_PAGE = 'Quay trở lại đơn hàng',
	RATING_NOW = 'Đánh giá ngay',
	PAY_NOW = 'Thanh toán ngay',
	CONTACT_SELLER = 'Liên hệ người bán',
	VIEW_RATING = 'Xem đánh giá',
	WRITE_RATING = 'Viết đánh giá',
	GO_TO_HOME = 'Quay về trang chủ',
	APPLY = 'Áp dụng',
	ORDER = 'Đặt hàng',
	RECALL = 'Thu hồi',
	RECALLED = 'Đã thu hồi',
}

export enum Content {
	ADDRESS_DELIVERY = 'Địa chỉ giao hàng',
	TOTAL = 'Tổng cộng',
	VIEW = 'Xem',
	GOODS_MONEY = 'Tiền hàng',
	SHIPPING_FEE = 'Phí ship',
	COMMERCIAL_FLOOR_FEE = 'Phí nền tảng',
	MONEY_RECEIVED_BY_THE_SHOP = 'Tiền shop nhận được',
	DATE_PURCHASED = 'Đặt hàng lúc',
	NAME_CATEGORY = 'Tên danh mục',
	IMAGE = 'Hình ảnh',
	PARENT_CATEGORY = 'Danh mục cha',
	EDIT_ATTRIBUTES = 'Chỉnh sửa thuộc tính',
	NAME_ATTRIBUTE = 'Tên thuộc tính',
	TYPE_ATTRIBUTE = 'Loại thuộc tính',
	OPTIONS_ATTRIBUTE = 'Các lựa chọn',
	DEFAULT_VALUE_ATTRIBUTE = 'Giá trị mặc định',
	PREFIX_UNIT_ATTRIBUTE = 'Đơn vị tiền tố',
	TEXT = 'Văn bản',
	NUMBER = 'Số',
	SELECT_BOX = 'Hộp chọn',
	NAME_COMMISSION = 'Tên hoa hồng',
	COMMISSION_FEE = 'Phí hoa hồng',
	COMMISSION_POINT = 'Điểm',
	NOT_FOUND = 'Không tìm thấy',
	CONFIRM_DELETE_COMMISSION = 'Hành vi sau không thể hoàn tác, Bạn có chắc chắn muốn xóa hoa hồng này?',
	CONFIRM_CANCEL_ORDER = 'Bạn có chắc chắn hủy đặt đơn hàng này',
	EXPECTED_PICKUP_DATE = 'Dự kiến lấy hàng',
	BUY_AGAIN = 'Mua lại',
	YOUR_ORDER_HAS_BEEN_CANCEL = 'Đơn hàng của bạn đã bị hủy',
	YOUR_ORDER_HAS_BEEN_ERROR = 'Đơn hàng của bạn đã bị lỗi',
	PAYMENT_ON_COD = 'Thanh toán khi nhận hàng',
	PAYMENT_ON_PAYPAL = 'Thanh toán bằng paypal',
	PAYMENT_ON_WALLET = 'Thanh toán bằng ví Latipe',
	PRODUCT_NOT_FOUND = 'Không tìm thấy sản phẩm nào',
	ALL = 'Tất cả',
	WAIT_FOR_PAY = 'Chờ thanh toán',
	SHIPPING = 'Vận chuyển',
	WAIT_FOR_DELIVERY = 'Chờ giao hàng',
	COMPLETE = 'Hoàn thành',
	CANCLED = 'Đã hủy',
	REFUND = 'Trả hàng/hoàn tiền',
	SEARCH_NOW = 'Tìm kiếm ngay',
}

export enum Title {
	ORDER_DETAIL = 'Chi tiết đơn hàng',
	UPDATE_PRODUCT = 'Cập nhật sản phẩm',
	DELETE_PRODUCT = 'Xóa sản phẩm',
	ADD_PRODUCT = 'Thêm sản phẩm',
	ADD_CATEGORY = 'Thêm danh mục',
	DELETE_CATEGORY = 'Xóa danh mục',
	UPDATE_CATEGORY = 'Cập nhật danh mục',
	ADD_ATTRIBUTES = 'Thêm thuộc tính',
	ADD_COMMISSION = 'Thêm hoa hồng',
	UPDATE_COMMISSION = 'Cập nhật hoa hồng',
	DELETE_COMMISSION = 'Xóa hoa hồng',
	COMMISSION = 'Hoa hồng',
	CANCEL_ORDER = 'Hủy đơn hàng',
	RATING_PRODUCT = 'Đánh giá sản phẩm',
	ORDER_CODE = 'Mã đơn hàng',
	ORDER_DATE = 'Đặt ngày',
	ORDER_DELIVERY = 'Vận chuyển',
	ORDER_ITEM_PRODUCT_ATTRIBUTE = 'Thuộc tính',
	ORDER_DELIVERY_RECIEVE = 'Địa Chỉ Nhận Hàng',
	TOTAL = 'Tổng cộng',
	ORDER_MONEY = 'Tiền hàng',
	ORDER_FEE_SHIPPING = 'Phí ship',
	ORDER_DISCOUNT_PRODUCT = 'Giảm giá sản phẩm',
	ORDER_DISCOUNT_FEE_SHIPPING = 'Giảm giá ship',
	ORDER_PAYMENT_METHOD = 'Phương thức Thanh toán',
	PRODUCT = 'Sản phẩm',

}

export enum VoucherStatus {
	ACTIVE = 1,
	INACTIVE = 0,
}

export enum Page {
	currentPage = 1,
	pageSize = 10,
}

export enum Order {
	OrderDeliverySuccess = "Đơn hàng được giao thành công",
}

export class OrderStatus {
	public static readonly ORDER_SYSTEM_PROCESS: number = 0;
	public static readonly ORDER_CREATED: number = 1;
	public static readonly ORDER_PREPARED: number = 2;
	public static readonly ORDER_DELIVERY: number = 3;
	public static readonly ORDER_SHIPPING_FINISH: number = 4;
	public static readonly ORDER_COMPLETED: number = 5;
	public static readonly ORDER_REFUND: number = 6;
	public static readonly ORDER_CANCEL_BY_USER: number = -2;
	public static readonly ORDER_CANCEL_BY_STORE: number = -3;
	public static readonly ORDER_CANCEL_BY_ADMIN: number = -4;
	public static readonly ORDER_CANCEL_BY_DELI: number = -5;
	public static readonly ORDER_CANCEL_USER_REJECT: number = -7;
	public static readonly ORDER_FAILED: number = -1;
}


