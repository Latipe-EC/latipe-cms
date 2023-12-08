import { QueryParamsType } from "api/AxiosClient";

/**
 * 
 * @export
 * @interface CreateStoreRequest
 */
export interface CreateStoreRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof CreateStoreRequest
	 */
	'name': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateStoreRequest
	 */
	'description': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateStoreRequest
	 */
	'logo'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateStoreRequest
	 */
	'cover'?: string;
}
/**
 * 
 * @export
 * @interface StoreResponse
 */
export interface StoreResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof StoreResponse
	 */
	'id': string;
	/**
	 * 
	 * @type {boolean}
	 * @memberof StoreResponse
	 */
	'isDeleted'?: boolean;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreResponse
	 */
	'name'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreResponse
	 */
	'description'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreResponse
	 */
	'logo'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreResponse
	 */
	'ownerId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreResponse
	 */
	'cover'?: string;
	'feePerOrder'?: number;
	'address'?: StoreAddress;
	'rating'?: number;
}


/**
 * 
 * @export
 * @interface UpdateStoreRequest
 */
export interface UpdateStoreRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateStoreRequest
	 */
	'name': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateStoreRequest
	 */
	'description': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateStoreRequest
	 */
	'logo'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateStoreRequest
	 */
	'cover'?: string;

	/**
	 * 
	 * @type {string}
	 * @memberof UpdateStoreRequest
	 */
	'address'?: StoreAddress;

	coverFile?: File;
	logoFile?: File;

}


/**
 * 
 * @export
 * @interface StoreAddress
 */
export interface StoreAddress {
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'contactName': string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'phone': string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'detailAddress': string;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'zipCode'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof StoreAddress
	 */
	'cityOrProvinceId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'cityOrProvinceName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof StoreAddress
	 */
	'districtId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'districtName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof StoreAddress
	 */
	'wardId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'wardName'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof StoreAddress
	 */
	'countryId'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof StoreAddress
	 */
	'countryName'?: string;
}



/**
 * 
 * @export
 * @interface ProductStoreResponse
 */
export interface ProductStoreResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof ProductStoreResponse
	 */
	'id': string;
	/**
	 * 
	 * @type {string}
	 * @memberof ProductStoreResponse
	 */
	'name'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof ProductStoreResponse
	 */
	'image'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof ProductStoreResponse
	 */
	'countProductVariants'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof ProductStoreResponse
	 */
	'countSale'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof ProductStoreResponse
	 */
	'reasonBan'?: string;
	'price'?: number;
	'rating'?: number;
}
export interface ProductStoreRequest {
	id: string,
	params: QueryParamsType
}

export interface GetMyStoreResponse {
	isDeleted: boolean
	id: string
	name: string
	description: string
	logo: string
	ownerId: string
	cover: string
	address: StoreAddress
	feePerOrder: number
	rating: number
	eWallet: number
}

