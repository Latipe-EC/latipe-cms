/**
 * 
 * @export
 * @interface CreateStoreRequest
 */
export interface CreateStoreRequest {
    /**
     * 
     * @type {File}
     * @memberof CreateStoreRequest
     */
    'file': File;
}
/**
 * 
 * @export
 * @interface MediaVm
 */
export interface MediaVm {
    /**
     * 
     * @type {string}
     * @memberof MediaVm
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof MediaVm
     */
    'fileName'?: string;
    /**
     * 
     * @type {string}
     * @memberof MediaVm
     */
    'mediaType'?: string;
    /**
     * 
     * @type {string}
     * @memberof MediaVm
     */
    'url'?: string;
    /**
     * 
     * @type {string}
     * @memberof MediaVm
     */
    'createdDate'?: string;
    /**
     * 
     * @type {string}
     * @memberof MediaVm
     */
    'lastModifiedDate'?: string;
}
/**
 * 
 * @export
 * @interface PageMediaVm
 */
export interface PageMediaVm {
    /**
     * 
     * @type {number}
     * @memberof PageMediaVm
     */
    'totalPages'?: number;
    /**
     * 
     * @type {number}
     * @memberof PageMediaVm
     */
    'totalElements'?: number;
    /**
     * 
     * @type {PageableObject}
     * @memberof PageMediaVm
     */
    'pageable'?: PageableObject;
    /**
     * 
     * @type {boolean}
     * @memberof PageMediaVm
     */
    'first'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageMediaVm
     */
    'last'?: boolean;
    /**
     * 
     * @type {number}
     * @memberof PageMediaVm
     */
    'size'?: number;
    /**
     * 
     * @type {Array<MediaVm>}
     * @memberof PageMediaVm
     */
    'content'?: Array<MediaVm>;
    /**
     * 
     * @type {number}
     * @memberof PageMediaVm
     */
    'number'?: number;
    /**
     * 
     * @type {SortObject}
     * @memberof PageMediaVm
     */
    'sort'?: SortObject;
    /**
     * 
     * @type {number}
     * @memberof PageMediaVm
     */
    'numberOfElements'?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageMediaVm
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
