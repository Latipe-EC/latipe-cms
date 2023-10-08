/**
 * 
 * @export
 * @interface PagedResultResponse
 */
export interface PagedResultResponse<T> {
    /**
     * 
     * @type {Pagination}
     * @memberof PagedResultResponse
     */
    'pagination'?: Pagination;
    /**
     * 
     * @type {Array<T>}
     * @memberof PagedResultResponse
     */
    'data'?: Array<T>;
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