/**
 * 
 * @export
 * @interface CartDetailResponse
 */
export interface CartDetailResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof CartDetailResponse
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartDetailResponse
	 */
	'productId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartDetailResponse
	 */
	'productOptionId'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CartDetailResponse
	 */
	'quantity'?: number;
}
/**
 * 
 * @export
 * @interface CartGetDetailResponse
 */
export interface CartGetDetailResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof CartGetDetailResponse
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartGetDetailResponse
	 */
	'userId'?: string;

	'productId'?: string;

	'productOptionId'?: string;
	'quantity'?: number;
	'productName'?: string;
	'storeId'?: string;
	'image'?: string;
	'storeName'?: string;
	'nameOption'?: string;
	'price'?: number;
}
/**
 * 
 * @export
 * @interface CartItemPutResponse
 */
export interface CartItemPutResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemPutResponse
	 */
	'cartItemId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemPutResponse
	 */
	'userId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemPutResponse
	 */
	'productId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemPutResponse
	 */
	'productOptionId'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CartItemPutResponse
	 */
	'quantity'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemPutResponse
	 */
	'status'?: string;
}
/**
 * 
 * @export
 * @interface CartItemRequest
 */
export interface CartItemRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemRequest
	 */
	'productId'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof CartItemRequest
	 */
	'quantity'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof CartItemRequest
	 */
	'productOptionId'?: string;
}
/**
 * 
 * @export
 * @interface CartListResponse
 */
export interface CartListResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof CartListResponse
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CartListResponse
	 */
	'userId'?: string;
}
/**
 * 
 * @export
 * @interface ExceptionResponse
 */
export interface ExceptionResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof ExceptionResponse
	 */
	'statusCode'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof ExceptionResponse
	 */
	'title'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof ExceptionResponse
	 */
	'timestamp'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof ExceptionResponse
	 */
	'detail'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof ExceptionResponse
	 */
	'path'?: string;
	/**
	 * 
	 * @type {Array<string>}
	 * @memberof ExceptionResponse
	 */
	'fieldErrors'?: Array<string>;
}
/**
 * 
 * @export
 * @interface PageCartListResponse
 */
export interface PageCartListResponse {
	/**
	 * 
	 * @type {number}
	 * @memberof PageCartListResponse
	 */
	'totalPages'?: number;
	/**
	 * 
	 * @type {number}
	 * @memberof PageCartListResponse
	 */
	'totalElements'?: number;
	/**
	 * 
	 * @type {PageableObject}
	 * @memberof PageCartListResponse
	 */
	'pageable'?: PageableObject;
	/**
	 * 
	 * @type {boolean}
	 * @memberof PageCartListResponse
	 */
	'first'?: boolean;
	/**
	 * 
	 * @type {boolean}
	 * @memberof PageCartListResponse
	 */
	'last'?: boolean;
	/**
	 * 
	 * @type {number}
	 * @memberof PageCartListResponse
	 */
	'size'?: number;
	/**
	 * 
	 * @type {Array<CartListResponse>}
	 * @memberof PageCartListResponse
	 */
	'content'?: Array<CartListResponse>;
	/**
	 * 
	 * @type {number}
	 * @memberof PageCartListResponse
	 */
	'number'?: number;
	/**
	 * 
	 * @type {SortObject}
	 * @memberof PageCartListResponse
	 */
	'sort'?: SortObject;
	/**
	 * 
	 * @type {number}
	 * @memberof PageCartListResponse
	 */
	'numberOfElements'?: number;
	/**
	 * 
	 * @type {boolean}
	 * @memberof PageCartListResponse
	 */
	'empty'?: boolean;
}
/**
 * 
 * @export
 * @interface Pageable
 */
export interface Pageable {
	/**
	 * 
	 * @type {number}
	 * @memberof Pageable
	 */
	'page'?: number;
	/**
	 * 
	 * @type {number}
	 * @memberof Pageable
	 */
	'size'?: number;
	/**
	 * 
	 * @type {Array<string>}
	 * @memberof Pageable
	 */
	'sort'?: Array<string>;
}
/**
 * 
 * @export
 * @interface PageableObject
 */
export interface PageableObject {
	/**
	 * 
	 * @type {number}
	 * @memberof PageableObject
	 */
	'pageNumber'?: number;
	/**
	 * 
	 * @type {number}
	 * @memberof PageableObject
	 */
	'pageSize'?: number;
	/**
	 * 
	 * @type {number}
	 * @memberof PageableObject
	 */
	'offset'?: number;
	/**
	 * 
	 * @type {SortObject}
	 * @memberof PageableObject
	 */
	'sort'?: SortObject;
	/**
	 * 
	 * @type {boolean}
	 * @memberof PageableObject
	 */
	'paged'?: boolean;
	/**
	 * 
	 * @type {boolean}
	 * @memberof PageableObject
	 */
	'unpaged'?: boolean;
}
/**
 * 
 * @export
 * @interface ProductFeatureRequest
 */
export interface ProductFeatureRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof ProductFeatureRequest
	 */
	'productId': string;
	/**
	 * 
	 * @type {string}
	 * @memberof ProductFeatureRequest
	 */
	'optionId': string;
}
/**
 * 
 * @export
 * @interface SortObject
 */
export interface SortObject {
	/**
	 * 
	 * @type {boolean}
	 * @memberof SortObject
	 */
	'sorted'?: boolean;
	/**
	 * 
	 * @type {boolean}
	 * @memberof SortObject
	 */
	'empty'?: boolean;
	/**
	 * 
	 * @type {boolean}
	 * @memberof SortObject
	 */
	'unsorted'?: boolean;
}

export interface UpdateQuantityRequest {
	id: string;
	quantity: number;
}


export interface DeleteCartItemRequest {
	ids: string[];
}

export interface CartResponse {
	"id": string;
	"userId": string;
	"productId": string;
	"productOptionId": string;
	"quantity": number;
	productName: string;
	storeId: string;
	storeName: string;
	image: string;
	nameOption: string
}