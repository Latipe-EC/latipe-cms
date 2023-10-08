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