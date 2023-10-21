/**
 * 
 * @export
 * @interface BanProductRequest
 */
export interface BanProductRequest {
    /**
     * 
     * @type {string}
     * @memberof BanProductRequest
     */
    'reason'?: string;
}
/**
 * 
 * @export
 * @interface CategoryResponse
 */
export interface CategoryResponse {
    /**
     * 
     * @type {string}
     * @memberof CategoryResponse
     */
    'id': string;
    /**
     * 
     * @type {boolean}
     * @memberof CategoryResponse
     */
    'isDeleted'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof CategoryResponse
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof CategoryResponse
     */
    'parentCategoryId'?: string;
    /**
     * 
     * @type {string}
     * @memberof CategoryResponse
     */
    'image'?: string;
}
/**
 * 
 * @export
 * @interface CreateCategoryRequest
 */
export interface CreateCategoryRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateCategoryRequest
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof CreateCategoryRequest
     */
    'parentCategoryId'?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateCategoryRequest
     */
    'image'?: string;
    /**
   * 
   * @type {File}
   * @memberof CreateCategoryRequest
   */
    'file'?: File;
}
/**
 * 
 * @export
 * @interface CreateProductRequest
 */
export interface CreateProductRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateProductRequest
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof CreateProductRequest
     */
    'description': string;
    /**
     * 
     * @type {number}
     * @memberof CreateProductRequest
     */
    'price'?: number;
    /**
     * 
     * @type {number}
     * @memberof CreateProductRequest
     */
    'promotionalPrice'?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateProductRequest
     */
    'categories': Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateProductRequest
     */
    'images'?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof CreateProductRequest
     */
    'quantity'?: number;
    /**
     * 
     * @type {Array<ProductVariantVm>}
     * @memberof CreateProductRequest
     */
    'productVariants'?: Array<ProductVariantVm>;
    /**
     * 
     * @type {boolean}
     * @memberof CreateProductRequest
     */
    'isPublished'?: boolean;
    /**
     * 
     * @type {Array<ProductClassificationVm>}
     * @memberof CreateProductRequest
     */
    'productClassifications'?: Array<ProductClassificationVm>;
}
/**
 * 
 * @export
 * @interface OrderProductCheckRequest
 */
export interface OrderProductCheckRequest {
    /**
     * 
     * @type {string}
     * @memberof OrderProductCheckRequest
     */
    'productId'?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderProductCheckRequest
     */
    'optionId'?: string;
    /**
     * 
     * @type {number}
     * @memberof OrderProductCheckRequest
     */
    'quantity'?: number;
}
/**
 * 
 * @export
 * @interface OrderProductResponse
 */
export interface OrderProductResponse {
    /**
     * 
     * @type {Array<ProductOrderVm>}
     * @memberof OrderProductResponse
     */
    'products'?: Array<ProductOrderVm>;
    /**
     * 
     * @type {number}
     * @memberof OrderProductResponse
     */
    'totalPrice'?: number;
}
/**
 * 
 * @export
 * @interface PagedResultDtoCategoryResponse
 */
export interface PagedResultDtoCategoryResponse {
    /**
     * 
     * @type {Pagination}
     * @memberof PagedResultDtoCategoryResponse
     */
    'pagination'?: Pagination;
    /**
     * 
     * @type {Array<CategoryResponse>}
     * @memberof PagedResultDtoCategoryResponse
     */
    'data'?: Array<CategoryResponse>;
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
 * @interface ProductClassification
 */
export interface ProductClassification {
    /**
     * 
     * @type {string}
     * @memberof ProductClassification
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductClassification
     */
    'image'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductClassification
     */
    'name'?: string;
    /**
     * 
     * @type {number}
     * @memberof ProductClassification
     */
    'quantity'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductClassification
     */
    'price'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductClassification
     */
    'promotionalPrice'?: number;
    /**
     * 
     * @type {string}
     * @memberof ProductClassification
     */
    'sku'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductClassification
     */
    'code'?: string;
}
/**
 * 
 * @export
 * @interface ProductClassificationVm
 */
export interface ProductClassificationVm {
    /**
     * 
     * @type {string}
     * @memberof ProductClassificationVm
     */
    'image'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductClassificationVm
     */
    'name'?: string;
    /**
     * 
     * @type {number}
     * @memberof ProductClassificationVm
     */
    'quantity'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductClassificationVm
     */
    'price'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductClassificationVm
     */
    'promotionalPrice'?: number;
    /**
     * 
     * @type {string}
     * @memberof ProductClassificationVm
     */
    'sku'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductClassificationVm
     */
    'code'?: string;
}
/**
 * 
 * @export
 * @interface ProductESDetailVm
 */
export interface ProductESDetailVm {
    /**
     * 
     * @type {string}
     * @memberof ProductESDetailVm
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductESDetailVm
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductESDetailVm
     */
    'slug'?: string;
    /**
     * 
     * @type {number}
     * @memberof ProductESDetailVm
     */
    'price'?: number;
    /**
     * 
     * @type {boolean}
     * @memberof ProductESDetailVm
     */
    'isPublished'?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductESDetailVm
     */
    'images'?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ProductESDetailVm
     */
    'description'?: string;
    /**
     * 
     * @type {Array<ProductClassification>}
     * @memberof ProductESDetailVm
     */
    'productClassifications'?: Array<ProductClassification>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductESDetailVm
     */
    'classifications'?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductESDetailVm
     */
    'categories'?: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof ProductESDetailVm
     */
    'isBanned'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProductESDetailVm
     */
    'isDeleted'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProductESDetailVm
     */
    'createdOn'?: string;
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
    'productId'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductFeatureRequest
     */
    'optionId'?: string;
}
/**
 * 
 * @export
 * @interface ProductOrderVm
 */
export interface ProductOrderVm {
    /**
     * 
     * @type {string}
     * @memberof ProductOrderVm
     */
    'productId'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductOrderVm
     */
    'name'?: string;
    /**
     * 
     * @type {number}
     * @memberof ProductOrderVm
     */
    'quantity'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductOrderVm
     */
    'price'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductOrderVm
     */
    'promotionalPrice'?: number;
    /**
     * 
     * @type {string}
     * @memberof ProductOrderVm
     */
    'optionId'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductOrderVm
     */
    'nameOption'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductOrderVm
     */
    'storeId'?: string;
    /**
     * 
     * @type {number}
     * @memberof ProductOrderVm
     */
    'totalPrice'?: number;
}
/**
 * 
 * @export
 * @interface ProductPriceVm
 */
export interface ProductPriceVm {
    /**
     * 
     * @type {number}
     * @memberof ProductPriceVm
     */
    'quantity'?: number;
    /**
     * 
     * @type {number}
     * @memberof ProductPriceVm
     */
    'price'?: number;
    /**
     * 
     * @type {string}
     * @memberof ProductPriceVm
     */
    'code'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductPriceVm
     */
    'image'?: string;
}
/**
 * 
 * @export
 * @interface ProductResponse
 */
export interface ProductResponse {
    /**
     * 
     * @type {string}
     * @memberof ProductResponse
     */
    'id': string;
    /**
     * 
     * @type {boolean}
     * @memberof ProductResponse
     */
    'isDeleted'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProductResponse
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof ProductResponse
     */
    'description': string;
    /**
     * 
     * @type {number}
     * @memberof ProductResponse
     */
    'price'?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductResponse
     */
    'images'?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof ProductResponse
     */
    'quantity'?: number;
    /**
     * 
     * @type {Array<ProductVariant>}
     * @memberof ProductResponse
     */
    'productVariants'?: Array<ProductVariant>;
    /**
     * 
     * @type {Array<ProductClassification>}
     * @memberof ProductResponse
     */
    'productClassifications'?: Array<ProductClassification>;
    /**
     * 
     * @type {boolean}
     * @memberof ProductResponse
     */
    'isBanned'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProductResponse
     */
    'isPublished'?: boolean;
    /**
     * 
     * @type {number}
     * @memberof ProductResponse
     */
    'countSale'?: number;
}
/**
 * 
 * @export
 * @interface ProductThumbnailVm
 */
export interface ProductThumbnailVm {
    /**
     * 
     * @type {string}
     * @memberof ProductThumbnailVm
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductThumbnailVm
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductThumbnailVm
     */
    'nameOption'?: string;
    /**
     * 
     * @type {number}
     * @memberof ProductThumbnailVm
     */
    'price'?: number;
    /**
     * 
     * @type {string}
     * @memberof ProductThumbnailVm
     */
    'thumbnailUrl'?: string;
}
/**
 * 
 * @export
 * @interface ProductVariant
 */
export interface ProductVariant {
    /**
     * 
     * @type {string}
     * @memberof ProductVariant
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductVariant
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductVariant
     */
    'image'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductVariant
     */
    'options'?: Array<Options>;


}

interface Options {
    option: string;
    file: File;
}
/**
 * 
 * @export
 * @interface ProductVariantVm
 */
export interface ProductVariantVm {
    /**
     * 
     * @type {string}
     * @memberof ProductVariantVm
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProductVariantVm
     */
    'image'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ProductVariantVm
     */
    'options'?: Array<string>;
}
/**
 * 
 * @export
 * @interface UpdateCategoryRequest
 */
export interface UpdateCategoryRequest {
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateCategoryRequest
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateCategoryRequest
     */
    'parentCategoryId'?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateCategoryRequest
     */
    'image'?: string;
    'file'?: File;
}
/**
 * 
 * @export
 * @interface UpdateProductQuantityRequest
 */
export interface UpdateProductQuantityRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateProductQuantityRequest
     */
    'productId': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateProductQuantityRequest
     */
    'optionId': string;
    /**
     * 
     * @type {number}
     * @memberof UpdateProductQuantityRequest
     */
    'quantity'?: number;
}
/**
 * 
 * @export
 * @interface UpdateProductRequest
 */
export interface UpdateProductRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateProductRequest
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateProductRequest
     */
    'description': string;
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateProductRequest
     */
    'categories'?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof UpdateProductRequest
     */
    'price'?: number;
    /**
     * 
     * @type {number}
     * @memberof UpdateProductRequest
     */
    'promotionalPrice'?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateProductRequest
     */
    'images'?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof UpdateProductRequest
     */
    'quantity'?: number;
    /**
     * 
     * @type {Array<ProductVariantVm>}
     * @memberof UpdateProductRequest
     */
    'productVariants'?: Array<ProductVariantVm>;
    /**
     * 
     * @type {Array<ProductClassificationVm>}
     * @memberof UpdateProductRequest
     */
    'productClassifications'?: Array<ProductClassificationVm>;
}

export interface Attribute {
    name: string;
    defaultValue: string;
    type: "string" | "number" | "selectbox";
    isRequired: boolean;
    prefixUnit?: string;
    options?: string[];
    value?: string;
}