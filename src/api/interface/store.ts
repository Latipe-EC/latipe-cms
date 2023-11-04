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
	'cityOrProvinceId'?: string;
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
	'districtId'?: string;
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
	'wardId'?: string;
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