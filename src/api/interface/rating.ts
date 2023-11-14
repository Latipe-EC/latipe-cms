/**
 * 
 * @export
 * @interface CreateRatingRequest
 */
export interface CreateRatingRequest {
	/**
	 * 
	 * @type {string}
	 * @memberof CreateRatingRequest
	 */
	'content': string;
	/**
	 * 
	 * @type {number}
	 * @memberof CreateRatingRequest
	 */
	'rating'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateRatingRequest
	 */
	'storeId': string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateRatingRequest
	 */
	'productId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateRatingRequest
	 */
	'detail'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof CreateRatingRequest
	 */
	'orderItemId'?: string;
}
/**
* 
* @export
* @interface PagedResultDtoRatingResponse
*/
export interface PagedResultDtoRatingResponse {
	/**
	 * 
	 * @type {Pagination}
	 * @memberof PagedResultDtoRatingResponse
	 */
	'pagination'?: Pagination;
	/**
	 * 
	 * @type {Array<RatingResponse>}
	 * @memberof PagedResultDtoRatingResponse
	 */
	'data'?: Array<RatingResponse>;
}
/**
* 
* @export
* @interface Pagination
*/
export interface Pagination {
	/**
	 * 
	 * @type {number}
	 * @memberof Pagination
	 */
	'total'?: number;
	/**
	 * 
	 * @type {number}
	 * @memberof Pagination
	 */
	'skip'?: number;
	/**
	 * 
	 * @type {number}
	 * @memberof Pagination
	 */
	'limit'?: number;
}
/**
* 
* @export
* @interface RatingResponse
*/
export interface RatingResponse {
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'id'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'content'?: string;
	/**
	 * 
	 * @type {number}
	 * @memberof RatingResponse
	 */
	'rating'?: number;
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'userId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'userName'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'productId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'storeId'?: string;
	/**
	 * 
	 * @type {string}
	 * @memberof RatingResponse
	 */
	'detail'?: string;
}
/**
* 
* @export
* @interface UpdateRatingRequest
*/
export interface UpdateRatingRequest {
	'id': string;
	/**
	 * 
	 * @type {string}
	 * @memberof UpdateRatingRequest
	 */
	'content': string;
	/**
	 * 
	 * @type {number}
	 * @memberof UpdateRatingRequest
	 */
	'rating'?: number;
}
