import { PagedResultResponse } from 'api/interface/PagedResultResponse';
import { LoginRequest, LoginResponse, RefreshTokenInput, RefreshTokenResponse } from '../api/interface/auth';
import { CreateUserAddressRequest, UpdateUserRequest, UpdateUsernameRequest, UserAddress, UserResponse } from '../api/interface/user';
import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	HeadersDefaults,
	ResponseType,
} from 'axios';
import { CategoryResponse, CreateCategoryRequest, CreateProductRequest, ProductFeatureRequest, ProductResponse, ProductThumbnailVm, UpdateCategoryRequest, UpdateProductRequest } from 'api/interface/product';
import { MediaVm } from 'api/interface/media';
import { StoreResponse, CreateStoreRequest, UpdateStoreRequest, ProductStoreResponse } from 'api/interface/store';
import { CreateRatingRequest, RatingResponse, UpdateRatingRequest } from 'api/interface/rating';
import { CartGetDetailResponse, CartItemRequest, CartResponse, DeleteCartItemRequest, UpdateQuantityRequest } from 'api/interface/cart';
import { ProductListGetVm, ProductNameListVm } from 'api/interface/search';
import { calculateShippingOrderRequest, createDeliveryRequest, listDeliveryRequest } from 'api/interface/delivery';
import { CancelOrderRequest, CountMyOrderResponse, CreateOrderRequest, CreateOrderResponse, GetMyOrderResponse, GetOrderByIdResponse } from 'api/interface/order';
import { ApplyVoucherReponse, ApplyVoucherRequest, createVoucherRequest } from 'api/interface/promotion';
import { CheckPaymentOrderResponse, PayByPaypalRequest, PayOrderRequest } from 'api/interface/payment';

export type QueryParamsType = Record<string | number, unknown>;

export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
		this.instance = axios.create({
			...axiosConfig,
			baseURL: 'http://localhost:8181/api/v1/',
		});
		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
		this.instance.interceptors.request.use(
			(config) => {
				const accessToken = this.getLocalAccessToken();
				if (accessToken) {
					config.headers['Authorization'] = `Bearer ${accessToken}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.instance.interceptors.response.use(
			(res) => {
				return res;
			},
			async (err) => {
				const originalRequest = err.config;
				if (err.response) {
					// Access Token was expired
					if (err.response.status === 401 && !originalRequest._retry) {
						originalRequest._retry = true;

						try {
							const refreshToken = localStorage.getItem('refreshToken');
							const response = await this.instance.post('/auth/refresh-token', {
								refreshToken: refreshToken,
							});
							if (response.data.accessToken) {
								localStorage.setItem('accessToken', response.data.accessToken);
								localStorage.setItem('REACT_STARTER_AUTH', JSON.stringify({
									accessToken: response.data.accessToken,
									isAuthenticated: true,
								}));
								this.instance.defaults.headers.common[
									'Authorization'
								] = `Bearer ${response.data.accessToken}`;
								originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
								return this.instance(originalRequest);
							}
						} catch (error) {
							// Xử lý lỗi
							console.log('Gửi lại request' + error);
						}
					}

					if (err.response.status === 403 && err.response.data) {
						return Promise.reject(err.response.data);
					}
				}

				return Promise.reject(err);
			}
		);
	}
	protected getLocalAccessToken = () => {
		return localStorage.getItem('accessToken');
	};
	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};
	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {}),
			},
		};
	}
	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}
	protected createFormData(input: Record<string, unknown>): FormData {
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: unknown[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}
	public request = async <T = unknown>({
		secure,
		path,
		type,
		query,
		format,
		body,
		...params
	}: FullRequestParams): Promise<AxiosResponse<T>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		try {
			const response = await this.instance.request({
				...requestParams,
				headers: {
					...(requestParams.headers || {}),
					...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
				},
				params: query,
				responseType: responseFormat,
				data: body,
				url: path,
			});
			return response;
		} catch (error) {
			if (error.response) {
				return error.response;
			}
			throw error;
		}
	};
}


export class Api<SecurityDataType> extends HttpClient<SecurityDataType> {
	auth = {
		/**
		 * No description
		 *
		 * @tags auth-controller
		 * @name CreateAuthenticationToken
		 * @request POST:/auth/login
		 */
		createAuthenticationToken: (data: LoginRequest) =>
			this.request<LoginResponse>({
				path: `/auth/login`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		/**
 * No description
 *
 * @tags auth-controller
 * @name RefreshAuthenticationToken
 * @request POST:/auth/refresh-token
 */
		refreshAuthenticationToken: (data: RefreshTokenInput) =>
			this.request<RefreshTokenResponse>({
				path: `/auth/refresh-token`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),
	};
	users = {

		addMyAddress: (data: CreateUserAddressRequest) =>
			this.request<UserAddress>({
				path: `/users/my-address`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		getMyAddress: (params: QueryParamsType) =>
			this.request<PagedResultResponse<UserAddress>>({
				path: `/users/my-address`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		countMyAddress: () =>
			this.request<number>({
				path: `/users/count-my-address`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getMyAddressById: (id: string) =>
			this.request<UserAddress>({
				path: `/users/my-address/${id}`,
				method: 'GET',
				type: ContentType.Json,

			}),

		updateMyAddress: (id: string, address: UserAddress) =>
			this.request<UserAddress>({
				path: `/users/my-address/${id}`,
				method: 'PUT',
				type: ContentType.Json,
				body: address

			}),

		deleteMyAddress: (id: string) =>
			this.request<UserAddress>({
				path: `/users/my-address/${id}`,
				method: 'DELETE',
				type: ContentType.Json,

			}),

		getMyProfile: () =>
			this.request<UserResponse>({
				path: `/users/my-profile`,
				method: 'GET',
				type: ContentType.Json,

			}),

		updateProfile: (request: UpdateUserRequest) =>
			this.request<UserResponse>({
				path: `/users/my-profile`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),

		updateUsername: (request: UpdateUsernameRequest) =>
			this.request<UserResponse>({
				path: `/users/profile/username`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),
	}
	category = {
		getCategories: (params: QueryParamsType) =>
			this.request<PagedResultResponse<CategoryResponse>>({
				path: `/categories/paginate`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getChildCategories: (parentId: string) =>
			this.request<CategoryResponse[]>({
				path: `/categories/children-categories/${parentId}`,
				method: 'GET',
				type: ContentType.Json,

			}),

		getCategory: (id: string) =>
			this.request<CategoryResponse>({
				path: `/categories/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		searchCategory: (params: QueryParamsType) =>
			this.request<CategoryResponse[]>({
				path: `/categories/search`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		addCategory: (data: CreateCategoryRequest) =>
			this.request<CategoryResponse>({
				path: `/categories`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		updateCategory: (category: UpdateCategoryRequest) =>
			this.request<CategoryResponse>({
				path: `/categories/${category.id}`,
				method: 'PUT',
				body: category,
				type: ContentType.Json,
			}),

		deleteCategory: (id: string) =>
			this.request<CategoryResponse>({
				path: `/categories/${id}`,
				method: 'DELETE',
				type: ContentType.Json,
			}),
	}
	media = {
		uploadFile: (data: {
			file: File
		}) =>
			this.request<MediaVm>({
				path: `/medias`,
				method: 'POST',
				body: data,
				type: ContentType.FormData,
			}),
	}
	product = {
		addProduct: (data: CreateProductRequest) =>
			this.request<ProductResponse>({
				path: `/products`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),
		updateProduct: (data: UpdateProductRequest) =>
			this.request<ProductResponse>({
				path: `/products/${data.id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
			}),

		getProductById: (id: string) =>
			this.request<ProductResponse>({
				path: `/products/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getFeatureProduct: (request: ProductFeatureRequest[]) =>
			this.request<ProductThumbnailVm[]>({
				path: `/products/list-featured`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),
	}
	store = {
		registerStore: (data: CreateStoreRequest) =>
			this.request<StoreResponse>({
				path: `/stores/register-store`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
			}),

		getMyProductStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<ProductStoreResponse>>({
				path: `/stores/my-products`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		getMyProductBanStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<ProductStoreResponse>>({
				path: `/stores/my-products/ban`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		update: (data: UpdateStoreRequest) =>
			this.request<StoreResponse>({
				path: `/stores/my-products/ban`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
			}),
	}
	rating = {
		getDetailRating: (id: string) =>
			this.request<RatingResponse>({
				path: `/ratings/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),
		/**
	 * 
	 * @param {string} productId 
	 * @param {number} skip 
	 * @param {number} size 
	 * @param {string} orderBy 
	 * @param {GetRatingFilterStarEnum} filterStar 
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 */
		getRatingProduct: (params: QueryParamsType) =>
			this.request<PagedResultResponse<RatingResponse>>({
				path: `/ratings/rating-product`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		/**
 * 
 * @param {string} productId 
 * @param {number} skip 
 * @param {number} size 
 * @param {string} orderBy 
 * @param {GetRatingFilterStarEnum} filterStar 
 * @param {*} [options] Override http request option.
 * @throws {RequiredError}
 */
		getRatingStore: (params: QueryParamsType) =>
			this.request<PagedResultResponse<RatingResponse>>({
				path: `/ratings/rating-store`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		/**
						*
						* @param {string} id
						* @param {UpdateRatingRequest} updateRatingRequest
						* @param {*} [options] Override http request option.
						* @throws {RequiredError}
						*/
		update: (id: string, updateRatingRequest: UpdateRatingRequest) =>
			this.request<RatingResponse>({
				path: `/ratings/${id}`,
				method: 'PUT',
				type: ContentType.Json,
				body: updateRatingRequest
			}),

		/**
			*
			* @param {string} id
			* @param {*} [options] Override http request option.
			* @throws {RequiredError}
			*/
		remove: (id: string) =>
			this.request<RatingResponse>({
				path: `/ratings/${id}`,
				method: 'DELETE',
				type: ContentType.Json,
			}),

		/**
			*
			* @param {CreateRatingRequest} createRatingRequest
			* @param {*} [options] Override http request option.
			* @throws {RequiredError}
			*/
		create: (createRatingRequest: CreateRatingRequest) =>
			this.request<RatingResponse>({
				path: `/ratings`,
				method: 'POST',
				type: ContentType.Json,
				body: createRatingRequest
			}),
	}
	cart = {
		getMyCart: (params: QueryParamsType) =>
			this.request<PagedResultResponse<CartGetDetailResponse>>({
				path: `/carts/my-cart`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		addToCart: (data: CartItemRequest) =>
			this.request<CartResponse>({
				path: `/carts/add-to-cart`,
				method: 'POST',
				type: ContentType.Json,
				body: data
			}),

		updateQuantity: (request: UpdateQuantityRequest) =>
			this.request<VoidFunction>({
				path: `/carts/${request.id}/quantity`,
				method: 'PUT',
				type: ContentType.Json,
				body: request
			}),

		deleteCartItem: (request: DeleteCartItemRequest) =>
			this.request<VoidFunction>({
				path: `/carts/multi-delete`,
				method: 'DELETE',
				type: ContentType.Json,
				body: request
			}),
		getMultiCart: (params: QueryParamsType) =>
			this.request<CartGetDetailResponse[]>({
				path: `/carts/multi-cart`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),
	}
	search = {
		searchProduct: (params: QueryParamsType) =>
			this.request<ProductListGetVm>({
				path: `/search/catalog-search`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),

		autoComplete: (params: QueryParamsType) =>
			this.request<ProductNameListVm>({
				path: `/search/search_suggest`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...params
				}
			}),
	}
	delivery = {
		getListDelivery: (request: listDeliveryRequest) =>
			this.request<[]>({
				path: `/delivery/shipping/anonymous`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		createDelivery: (request: createDeliveryRequest) =>
			this.request<unknown>({
				path: `/delivery/admin`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		calculateShippingOrder: (request: calculateShippingOrderRequest) =>
			this.request<unknown>({
				path: `/delivery/shipping/order`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),
	}
	order = {
		createOrder: (request: CreateOrderRequest) =>
			this.request<CreateOrderResponse>({
				path: `/orders/user`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getMyOrder: (query: Record<string, string>) => {
			const queryParams = new URLSearchParams(query).toString();
			console.log(queryParams);
			return this.request<GetMyOrderResponse>({
				path: `/orders/user?${queryParams}`,
				method: 'GET',
				type: ContentType.Json,

			})
		},

		cancelOrder: (request: CancelOrderRequest) =>
			this.request<unknown>({
				path: `/orders/user/cancel`,
				method: 'PATCH',
				type: ContentType.Json,
				body: request
			}),


		getOrderById: (id: string) =>
			this.request<GetOrderByIdResponse>({
				path: `/orders/user/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),


		countMyOrder: () =>
			this.request<CountMyOrderResponse>({
				path: `/orders/user/count`,
				method: 'GET',
				type: ContentType.Json,
			}),
	}
	promotion = {
		applyVoucher: (request: ApplyVoucherRequest) =>
			this.request<ApplyVoucherReponse>({
				path: `/vouchers/apply`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		createVoucher: (request: createVoucherRequest) =>
			this.request<unknown>({
				path: `/vouchers`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		getById: (id: string) =>
			this.request<unknown>({
				path: `/vouchers/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getByCode: (code: string) =>
			this.request<unknown>({
				path: `/vouchers/code/${code}`,
				method: 'GET',
				type: ContentType.Json,
			}),

		getAll: (param: QueryParamsType) =>
			this.request<[]>({
				path: `/vouchers`,
				method: 'GET',
				type: ContentType.Json,
				query: {
					...param
				}
			}),
	}
	payment = {
		checkPaymentOrder: (id: string) =>
			this.request<CheckPaymentOrderResponse>({
				path: `/payment/payment-order/${id}`,
				method: 'POST',
				type: ContentType.Json,
			}),

		validPayment: (request: PayOrderRequest) =>
			this.request<void>({
				path: `/payment/pay`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		payByPaypal: (request: PayByPaypalRequest) =>
			this.request<void>({
				path: `/payment/capture-payments/paypal`,
				method: 'POST',
				type: ContentType.Json,
				body: request
			}),

		checkOrderPaypal: (id: string) =>
			this.request<void>({
				path: `/payment/check-order-paypal/${id}`,
				method: 'GET',
				type: ContentType.Json,
			}),
	}
}

/**
 * @export
 */
export const GetRatingFilterStarEnum = {
	All: 'ALL',
	One: 'ONE',
	Two: 'TWO',
	Three: 'THREE',
	Four: 'FOUR',
	Five: 'FIVE'
} as const;
export type GetRatingFilterStarEnum = typeof GetRatingFilterStarEnum[keyof typeof GetRatingFilterStarEnum];
